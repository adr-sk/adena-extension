import React, { useMemo } from 'react';

import { WebMain } from '@components/atoms';
import useWalletExportScreen from '@hooks/web/wallet-export/use-wallet-export-screen';
import WalletExportCheckPassword from './check-password';
import WalletExportResult from './result';
import SensitiveInfoStep from '@components/pages/web/sensitive-info-step';
import { ADENA_DOCS_PAGE } from '@common/constants/resource.constant';
import { WebSecurityHeader } from '@components/pages/web/security-header';
import { WebMainAccountHeader } from '@components/pages/web/main-account-header';

const WalletExportScreen: React.FC = () => {
  const {
    currentAccount,
    exportType,
    walletExportState,
    exportData,
    backStep,
    initWalletExport,
    checkPassword,
    moveExport,
  } = useWalletExportScreen();

  const description = useMemo(() => {
    if (exportType === 'PRIVATE_KEY') {
      return 'You’re about to reveal your private key. Your private key is the only way to\nrecover your account. Be sure to store it in a safe place.';
    }
    return 'You are about to reveal your seed phrase. Your seed phrase is the only\nway to recover your wallet. Be sure to store it in a safe place.';
  }, [exportType]);

  return (
    <WebMain>
      {walletExportState === 'INIT' && (
        <WebSecurityHeader
          currentStep={0}
          stepLength={2}
          visibleBackButton={walletExportState !== 'INIT'}
          onClickGoBack={backStep}
        />
      )}
      {walletExportState !== 'INIT' && (
        <WebMainAccountHeader
          account={currentAccount}
          onClickGoBack={backStep}
        />
      )}

      {walletExportState === 'INIT' && (
        <SensitiveInfoStep
          desc={description}
          onClickNext={initWalletExport}
          link={
            exportType === 'PRIVATE_KEY'
              ? `${ADENA_DOCS_PAGE}/user-guide/sidebar-menu/settings/security-and-privacy/export-private-key`
              : `${ADENA_DOCS_PAGE}/user-guide/sidebar-menu/settings/security-and-privacy/reveal-seed-phrase`
          }
        />
      )}
      {walletExportState === 'CHECK_PASSWORD' && (
        <WalletExportCheckPassword
          exportType={exportType}
          checkPassword={checkPassword}
          moveExport={moveExport}
        />
      )}
      {walletExportState === 'RESULT' && (
        <WalletExportResult exportType={exportType} exportData={exportData} />
      )}
    </WebMain>
  );
};

export default WalletExportScreen;
