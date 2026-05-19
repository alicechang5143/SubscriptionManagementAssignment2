const IPaymentAdapter = require('./IPaymentAdapter');

// Production: const paypal = require('@paypal/checkout-server-sdk');

class PayPalAdapter extends IPaymentAdapter {
  async charge({ amount, currency = 'USD', description }) {
    // Production: paypal.orders.create({ intent: 'CAPTURE', purchase_units: [{ amount: { value: amount, currency_code: currency }, description }] })
    return {
      transactionId: `paypal_${Date.now()}`,
      status: 'COMPLETED',
      amount,
      currency,
    };
  }

  async refund(transactionId) {
    // Production: paypal.captures.refund(transactionId, {})
    return {
      transactionId,
      status: 'REFUNDED',
    };
  }
}

module.exports = PayPalAdapter;
