class IPaymentAdapter {
  async charge({ amount, currency, description }) {
    throw new Error('charge() must be implemented by the adapter');
  }

  async refund(transactionId) {
    throw new Error('refund() must be implemented by the adapter');
  }
}

module.exports = IPaymentAdapter;
