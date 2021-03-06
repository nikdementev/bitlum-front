/**
 * Component to display name and button for name generation
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';

import logger from 'utils/logging';

import receiveIcon from 'assets/icons/plus-circle.svg';

import { Root, Main, Additional, Receive, Send, Img, Span } from './styles';

const log = logger();

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

export const BalanceSummary = ({ accounts, className, appearance = 'normal', denomination, t }) => {

  if (!accounts.get.data && accounts.get.loading) {
    return (
      <Root className={className} appearance={appearance}>
        <Span>Loading balance info...</Span>
      </Root>
    );
  }

  if (
    (accounts.get.error && !accounts.get.data) ||
    (!accounts.get.error && (!accounts.get.data || !accounts.get.data.balances))
  ) {
    return (
      <Root className={className} appearance={appearance}>
        <Span>Unable to load balance info</Span>
      </Root>
    );
  }

  if (appearance === 'onlyBalance') {
    return (
      <Root className={className} loading={accounts.get.loading} appearance={appearance}>
        Available
        {Object.keys(accounts.get.data.balances).map(asset => [
          <Main key={`${asset}Main`}>
            {accounts.get.data.balances[asset].denominationsAvailable[denomination].toString()}
          </Main>,
        ])}
      </Root>
    );
  }
  return (
    <Root className={className} loading={accounts.get.loading} appearance={appearance}>
      <Receive to="/payments/receive/check">
        <Span>Receive</Span>
        <Img src={receiveIcon} />
      </Receive>
      {Object.keys(accounts.get.data.balances).map(asset => [
        <Main key={`${asset}Main`}>
          {accounts.get.data.balances[asset].denominationsAvailable.main.toString()}
        </Main>,
        <Additional key={`${asset}Additional`}>
          {accounts.get.data.balances[asset].denominationsAvailable.additional.toString()}
        </Additional>,
      ])}
      {/* <Send to={totalBalance === 0 ? '/payments/receive/check' : '/payments/check'}>
        {totalBalance === 0 ? 'Receive' : 'Pay'}
      </Send> */}
    </Root>
  );
};

BalanceSummary.propTypes = {};

BalanceSummary.defaultProps = {};

export default BalanceSummary;
