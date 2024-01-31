import { useEffect, useState } from 'react';
import { AdenaLedgerConnector, AdenaWallet, Wallet, Account, serializeAccount } from 'adena-module';
import useAppNavigate from '@hooks/use-app-navigate';
import { RoutePath } from '@types';

export type UseConnectLedgerDeviceScreenReturn = {
  connectState: ConnectLedgerStateType;
  setConnectState: React.Dispatch<React.SetStateAction<ConnectLedgerStateType>>;
  initWallet: () => Promise<void>;
  requestPermission: () => Promise<void>;
};

export type ConnectLedgerStateType =
  | 'INIT'
  | 'REQUEST'
  | 'NOT_PERMISSION'
  | 'REQUEST_WALLET'
  | 'REQUEST_WALLET_LOAD'
  | 'FAILED'
  | 'SUCCESS';

export const connectLedgerStep: Record<
  ConnectLedgerStateType,
  {
    backTo: ConnectLedgerStateType;
    stepNo: number;
  }
> = {
  INIT: {
    backTo: 'INIT',
    stepNo: 0,
  },
  REQUEST: {
    backTo: 'INIT',
    stepNo: 1,
  },
  NOT_PERMISSION: {
    backTo: 'REQUEST',
    stepNo: 1,
  },
  REQUEST_WALLET: {
    backTo: 'REQUEST',
    stepNo: 2,
  },
  REQUEST_WALLET_LOAD: {
    backTo: 'REQUEST_WALLET',
    stepNo: 3,
  },
  FAILED: {
    backTo: 'REQUEST_WALLET_LOAD',
    stepNo: 3,
  },
  SUCCESS: {
    backTo: 'INIT',
    stepNo: 3,
  },
};

const useConnectLedgerDeviceScreen = (): UseConnectLedgerDeviceScreenReturn => {
  const { navigate } = useAppNavigate();
  const [connectState, setConnectState] = useState<ConnectLedgerStateType>('INIT');
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    if (connectState === 'FAILED') {
      const intervalRequest = setTimeout(() => {
        requestHardwareWallet();
      }, 1000);
      return () => clearTimeout(intervalRequest);
    }
    if (connectState === 'SUCCESS' && wallet) {
      const serializedAccounts = wallet.accounts.map((account: Account) =>
        serializeAccount(account),
      );
      navigate(RoutePath.WebConnectLedgerSelectAccount, {
        state: { accounts: serializedAccounts },
      });
    }
  }, [connectState, wallet]);

  const initWallet = async (): Promise<void> => {
    requestPermission();
  };

  const requestPermission = async (): Promise<void> => {
    setConnectState('REQUEST');
    try {
      const connected = await checkHardwareConnect();
      const transport = connected
        ? await AdenaLedgerConnector.openConnected()
        : await AdenaLedgerConnector.request();
      await transport?.close();
      setConnectState('REQUEST_WALLET');
      requestHardwareWallet();
    } catch (e) {
      setConnectState('NOT_PERMISSION');
    }
  };

  const checkHardwareConnect = async (): Promise<boolean> => {
    const devices = await AdenaLedgerConnector.devices();
    if (devices.length === 0) {
      return false;
    }

    return true;
  };

  const requestHardwareWallet = async (): Promise<void> => {
    let retry = true;
    try {
      const connectedCosmosApp = await checkHardwareConnect();
      if (!connectedCosmosApp) {
        setConnectState('NOT_PERMISSION');
        return;
      }
    } catch (e) {
      setConnectState('NOT_PERMISSION');
    }

    try {
      setConnectState('REQUEST_WALLET');
      const transport = await AdenaLedgerConnector.openConnected();
      setConnectState('REQUEST_WALLET_LOAD');
      if (!transport) {
        throw new Error('Not found Connect');
      }
      const initHdPaths = [0, 1, 2, 3, 4];
      const ledgerConnector = AdenaLedgerConnector.fromTransport(transport);
      const wallet = await AdenaWallet.createByLedger(ledgerConnector, initHdPaths);
      await transport?.close();
      setWallet(wallet);
      setConnectState('SUCCESS');
      retry = false;
    } catch (e) {
      if (e instanceof Error) {
        if (e.message !== 'The device is already open.') {
          console.log(e);
        }
      }
    }

    if (retry) {
      setConnectState('FAILED');
    }
  };

  return {
    connectState,
    setConnectState,
    initWallet,
    requestPermission,
  };
};

export default useConnectLedgerDeviceScreen;