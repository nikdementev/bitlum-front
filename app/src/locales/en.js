/**
 * English translation
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

export default {
  empty: '',
  general: {
    // Company name to use in copyrights e.t.c.
    companyName: 'Bitlum',
    testnetURL: 'https://testnet.bitlum.io',
    mainnetURL: 'https://mainnet.bitlum.io',
  },
  nav: {
    home: 'Home',
    login: 'Login',
    signup: 'Sign Up',
    signout: 'Sign Out',
    payments: 'Payments',
    account: 'Account',
    send: 'Send',
    receive: 'Receive',
  },
  payments: {
    states: {
      pending: 'Pending',
      completed: 'Completed',
    },
    from: 'From',
    to: 'To',
    hash: 'Payment hash',
    txid: 'TXID',
    types: {
      lightning: 'Lightning',
      blockchain: 'Blockchain',
    },
    amount: 'Amount',
    amountInvalid: 'Wrong amount',
    send: 'Send payment',
    receive: 'Receive payment',
    addressType: {
      lightning: 'Invoice',
      blockchain: 'Address',
    },
  },
  account: {
    id: 'Account ID',
    restrictions: 'Restrictions',
    balance: 'Balance',
  },
  auth: {
    email: 'Your email',
    emailInvalid: 'Wrong email',
    password: 'Your password',
    passwordInvalid: 'Wrong password',
  },
  confirmed: {
    failed: {
      description: 'Your payment failed, but we’re not sure why',
      cta: 'Contact us',
    },
    completed: {
      description: '',
      cta: '',
    },
    pending: {
      description: 'Payment has been sent, but is still in a pending state',
      cta: 'View transactions',
    },
  },
};
