const IPaymentAdapter = require('./IPaymentAdapter');

// Production: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeAdapter extends IPaymentAdapter {
  async charge({ amount, currency = 'usd', description }) {
    // Production: await stripe.paymentIntents.create({ amount: amount * 100, currency, description })
    return {
      transactionId: `stripe_${Date.now()}`,
      status: 'succeeded',
      amount,
      currency,
    };
  }

  async refund(transactionId) {
    // Production: await stripe.refunds.create({ payment_intent: transactionId })
    return {
      transactionId,
      status: 'refunded',
    };
  }
}

module.exports = StripeAdapter;
