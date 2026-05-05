const BaseRepository = require('./BaseRepository');
const Subscription = require('../models/Subscription');

class SubscriptionRepository extends BaseRepository {
  constructor() {
    super(Subscription);
  }

  async findByUser(userId) {
    return this.findAll({ user: userId }, { populate: 'plan', sort: { createdAt: -1 } });
  }

  async findUserSubscription(subscriptionId, userId) {
    return this.findOne({ _id: subscriptionId, user: userId }, { populate: 'plan' });
  }

  async updateUserSubscription(subscriptionId, userId, data) {
    return this.model
      .findOneAndUpdate({ _id: subscriptionId, user: userId }, data, { new: true, runValidators: true })
      .populate('plan');
  }

  async deleteUserSubscription(subscriptionId, userId) {
    return this.model.findOneAndDelete({ _id: subscriptionId, user: userId });
  }
}

module.exports = SubscriptionRepository;
