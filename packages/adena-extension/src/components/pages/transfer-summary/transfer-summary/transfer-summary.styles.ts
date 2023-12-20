import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const TransferSummaryWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 5px;
  min-height: 444px;
  align-items: center;
  justify-content: flex-start;

  .sub-header-wrapper {
    width: 100%;
  }

  .info-wrapper {
    width: 100%;
    margin-top: 25px;
  }

  .direction-icon-wrapper {
    width: 100%;
    text-align: center;
    margin: 10px 0;
  }

  .network-fee-wrapper {
    width: 100%;
    height: 100%;
    margin-top: 20px;

    .error-message {
      position: relative;
      width: 100%;
      padding: 0 16px;
      ${({ theme }): FlattenSimpleInterpolation => theme.fonts.captionReg};
      color: ${({ theme }): string => theme.color.red[2]};
    }
  }

  .button-group {
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 0;
    justify-content: space-between;

    button {
      width: 100%;
      height: 48px;
      border-radius: 30px;
      ${({ theme }): FlattenSimpleInterpolation => theme.fonts.body1Bold};
      background-color: ${({ theme }): string => theme.color.neutral[4]};
      transition: 0.2s;

      :hover {
        background-color: ${({ theme }): string => theme.color.neutral[5]};
      }

      &:last-child {
        margin-left: 10px;
      }

      &.send {
        background-color: ${({ theme }): string => theme.color.primary[3]};

        :hover {
          background-color: ${({ theme }): string => theme.color.primary[4]};
        }
      }
    }
  }
`;