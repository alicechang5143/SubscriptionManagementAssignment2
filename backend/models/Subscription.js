const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
    renewedAt: { type: Date },
    renewalCount: { type: Number, default: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
