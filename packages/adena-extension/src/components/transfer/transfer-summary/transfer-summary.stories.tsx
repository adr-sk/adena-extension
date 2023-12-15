import React from 'react';
import TransferSummary, { type TransferSummaryProps } from './transfer-summary';
import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'components/transfer/TransferSummary',
  component: TransferSummary,
} as Meta<typeof TransferSummary>;

export const Default: StoryObj<TransferSummaryProps> = {
  args: {
    isErrorNetworkFee: false,
    tokenMetainfo: {
      main: true,
      display: false,
      tokenId: 'Gnoland',
      networkId: 'DEFAULT',
      name: 'Gnoland',
      image: '',
      symbol: 'GNOT',
      type: 'gno-native',
      decimals: 6,
    },
    tokenImage: 'https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg',
    transferBalance: {
      value: '4,000.123',
      denom: 'GNOT',
    },
    toAddress: 'g1fnakf9vrd6uqn8qdmp88yac4p0ngy572answ9f',
    networkFee: {
      value: '0.0048',
      denom: 'GNOT',
    },
    onClickBack: action('click back'),
    onClickCancel: action('click cancel'),
    onClickSend: action('click send'),
  },
  render: (args) => (
    <div style={{ height: '500px' }}>
      <TransferSummary {...args} />
    </div>
  ),
};