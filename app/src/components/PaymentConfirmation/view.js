/**
 * Component to display name and button for name generation
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import log from 'utils/logging';
import LiveChat from 'utils/LiveChat';

import {
  Root,
  Input,
  Button,
  Fees,
  SendResult,
  SendResultDesc,
  SendResultCta,
  SendResultIcon,
  SwitchDenomination,
  Description,
  Submit,
  Message,
  P,
  Done,
  Img,
  Span,
  Vendor,
  AmountInput,
  AmountInputWraper,
  BalanceSummary,
} from './styles';

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

export class PaymentConfirmation extends Component {
  state = {
    amountsOriginal: this.props.payment.amount,
    amountsCurrent:
      this.props.payment.amount != 0
        ? this.props.payment.amount *
          this.props.settings.get.data.denominations[this.props.payment.asset].main.price
        : undefined,
    amountsPrevious: undefined,
    selectedDenomination: 'main',
    denominationPairs: {
      main: 'additional',
      additional: 'main',
    },
  };
  componentWillMount() {
    const { payments, payment } = this.props;
    payments.estimate.run(payment.wuid, payment.amount, payment.asset);
  }
  componentWillUnmount() {
    const { payments } = this.props;
    payments.send.cleanup();
    payments.estimate.cleanup();
  }

  componentDidUpdate() {
    const { payments } = this.props;
    if (payments.send.data) {
      // setTimeout(window.close, 3000);
    }
  }

  render() {
    const { payment, payments, vendors, settings, accounts, className, t } = this.props;
    const {
      amountsOriginal,
      amountsCurrent,
      amountsPrevious,
      denominationPairs,
      selectedDenomination,
    } = this.state;

    const { denominations } =
      ((payments.estimate.data || (payments.estimate.error && payments.estimate.error.fees)) &&
        payments.calcDenominations(
          payments.estimate.data ||
            (payments.estimate.error && {
              asset: payment.asset,
              fees: payments.estimate.error.fees,
              amount:
                (amountsCurrent || 0) /
                settings.get.data.denominations[payment.asset][selectedDenomination].price,
            }),
        )) ||
      {};

    return (
      <Root
        className={className}
        onSubmit={async e => {
          e.preventDefault();
          const amount =
            amountsOriginal != 0
              ? amountsOriginal
              : (amountsCurrent || 0) /
                settings.get.data.denominations[payment.asset][selectedDenomination].price;
          const result = await payments.send.run(payment.wuid, amount, payment.asset, {
            origin: payment.origin,
          });

          LiveChat.track(
            `${payment.origin || 'unknown'}_payment_${payment.asset}_${
              result.error ? 'error' : 'created'
            }`,
            {
              amount,
            },
          );

          LiveChat.track(`payment_${payment.asset}_${result.error ? 'error' : 'created'}`, {
            amount,
          });
        }}
        loading={payments.estimate.loading || payments.send.loading}
      >
        {payments.send.data ? (
          <SendResult status={payments.send.data.status}>
            <SendResultIcon status={payments.send.data.status} />
            <P>Payment {payments.send.data.status}</P>
            <SendResultDesc>
              {t(`confirmed.${payments.send.data.status}.description`)}
            </SendResultDesc>
            <SendResultCta
              className={payments.send.data.status === 'failed' ? 'openIntercom' : ''}
              onClick={e => {
                if (payments.send.data.status === 'pending') {
                  window.location.hash = '';
                }
              }}
            >
              {t(`confirmed.${payments.send.data.status}.cta`)}
            </SendResultCta>
            <Done
              primary
              onClick={e => {
                e.preventDefault();
                window.close();
              }}
            >
              Done
            </Done>
          </SendResult>
        ) : null}
        {vendors.get.error ? (
          <Vendor>Unable to load vendor data</Vendor>
        ) : (
          <Vendor color={vendors.get.data && vendors.get.data[0] && vendors.get.data[0].color}>
            <Img src={vendors.get.data && vendors.get.data[0] && vendors.get.data[0].iconUrl} />
            <P>
              <Span>{vendors.get.data && vendors.get.data[0] && vendors.get.data[0].name}</Span>
              <Span>{payment.wuid}</Span>
            </P>
          </Vendor>
        )}
        <AmountInputWraper>
          {settings.get.data.denominations[payment.asset][selectedDenomination].sign}
          <AmountInput
            ref={input => input && input.focus()}
            length={(amountsCurrent || '').toString().length}
            placeholder="0"
            id="sendAmount"
            type="number"
            step={
              1 /
              10 **
                settings.get.data.denominations[payment.asset][selectedDenomination].precisionMax
            }
            min="0"
            value={amountsCurrent}
            disabled={payment.amount != 0}
            onChange={e => {
              if (!payments.estimate.loading) {
                this.setState({ amountsCurrent: e.target.value });
                payments.estimate.run(
                  payment.wuid,
                  e.target.value /
                    settings.get.data.denominations[payment.asset][selectedDenomination].price,
                  payment.asset,
                );
              }
            }}
            required
          />
          <SwitchDenomination
            primary
            disabled={!denominations}
            onClick={e => {
              e.preventDefault();
              const convertedAmount = settings.get.data.denominations[payment.asset][
                denominationPairs[selectedDenomination]
              ].round(denominations[denominationPairs[selectedDenomination]].amount);
              this.setState({
                selectedDenomination: denominationPairs[selectedDenomination],
                amountsCurrent: convertedAmount === 0 ? undefined : convertedAmount,
              });
            }}
          >
            {denominations && denominations[denominationPairs[selectedDenomination]].sign}
          </SwitchDenomination>
        </AmountInputWraper>
        <BalanceSummary
          appearance="onlyBalance"
          denomination={selectedDenomination}
          accounts={accounts}
          notEnough={payments.estimate.error && payments.estimate.error.code === '403RPA01'}
        />
        {false && <Message type="error"> {{}.message} </Message>}
        {payments.estimate.error && (
          <Message type="error">
            {' '}
            {payments.estimate.error.code === '403RPA01'
              ? 'You do not have enough balance'
              : t([`errors.${payments.estimate.error.code}`, 'errors.default'])}{' '}
          </Message>
        )}
        {payments.send.error && (
          <Message type="error">
            {t([`errors.${payments.send.error.code}`, 'errors.default'])}
          </Message>
        )}
        {payment.description ? (
          <Description>
            <Span>Description</Span> <Span>{payment.description}</Span>
          </Description>
        ) : null}
        <Fees>
          <Span>Fee</Span>
          <Span>
            {denominations &&
              denominations[selectedDenomination].toString({ omitDirection: true }).fees}
          </Span>
        </Fees>
        <Submit primary type="submit" disabled={payments.estimate.error}>
          <Span>Pay</Span>
          <Span>
            {denominations &&
              denominations[selectedDenomination].toString({ omitDirection: true }).total}
          </Span>
        </Submit>
      </Root>
    );
  }
}

PaymentConfirmation.propTypes = {};

PaymentConfirmation.defaultProps = {};

export default PaymentConfirmation;
