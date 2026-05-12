const SubscriptionRepository = require('../repositories/SubscriptionRepository');
const PlanRepository = require('../repositories/PlanRepository');
const AppError = require('../utils/AppError');
const subscriptionEventManager = require('../observers/SubscriptionEventManager');
const StripeAdapter = require('../adapters/StripeAdapter');

class SubscriptionService {
  constructor(
    subscriptionRepository = new SubscriptionRepository(),
    planRepository = new PlanRepository(),
    eventManager = subscriptionEventManager,
    paymentAdapter = new StripeAdapter()
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.planRepository = planRepository;
    this.eventManager = eventManager;
    this.paymentAdapter = paymentAdapter;
  }

  async createSubscription(userId, planId) {
    if (!planId) throw new AppError('Plan id is required', 400);

    const plan = await this.planRepository.findById(planId);
    if (!plan || plan.isActive === false) throw new AppError('Selected plan not found or inactive', 404);

    await this.paymentAdapter.charge({
      amount: plan.price,
      currency: 'usd',
      description: `Subscription to ${plan.name}`,
    });

    const subscription = await this.subscriptionRepository.create({
      user: userId,
      plan: planId,
      status: 'active',
      startDate: new Date(),
      renewalCount: 0,
    });

    const populated = await this.subscriptionRepository.findById(subscription._id, { populate: 'plan' });
    this.eventManager.notify('SUBSCRIPTION_CREATED', {
      subscriptionId: subscription._id,
      userId,
      status: 'active',
    });
    return populated;
  }

  async getUserSubscriptions(userId) {
    return this.subscriptionRepository.findByUser(userId);
  }

  async updateSubscription(userId, subscriptionId, updates) {
    const allowed = {
      status: updates.status,
      plan: updates.plan,
      notes: updates.notes,
    };
    Object.keys(allowed).forEach((key) => allowed[key] === undefined && delete allowed[key]);

    const updated = await this.subscriptionRepository.updateUserSubscription(subscriptionId, userId, allowed);
    if (!updated) throw new AppError('Subscription not found', 404);

    this.eventManager.notify('SUBSCRIPTION_UPDATED', { subscriptionId, userId, status: updated.status });
    return updated;
  }

  async cancelSubscription(userId, subscriptionId) {
    const updated = await this.subscriptionRepository.updateUserSubscription(subscriptionId, userId, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });
    if (!updated) throw new AppError('Subscription not found', 404);

    this.eventManager.notify('SUBSCRIPTION_CANCELLED', { subscriptionId, userId, status: 'cancelled' });
    return updated;
  }

  async renewSubscription(userId, subscriptionId) {
    const current = await this.subscriptionRepository.findUserSubscription(subscriptionId, userId);
    if (!current) throw new AppError('Subscription not found', 404);

    await this.paymentAdapter.charge({
      amount: current.plan?.price ?? 0,
      currency: 'usd',
      description: `Renewal of ${current.plan?.name ?? 'subscription'}`,
    });

    const renewed = await this.subscriptionRepository.updateUserSubscription(subscriptionId, userId, {
      status: 'active',
      renewedAt: new Date(),
      renewalCount: (current.renewalCount || 0) + 1,
    });

    this.eventManager.notify('SUBSCRIPTION_RENEWED', { subscriptionId, userId, status: 'active' });
    return renewed;
  }

  async deleteSubscription(userId, subscriptionId) {
    const deleted = await this.subscriptionRepository.deleteUserSubscription(subscriptionId, userId);
    if (!deleted) throw new AppError('Subscription not found', 404);
    this.eventManager.notify('SUBSCRIPTION_DELETED', { subscriptionId, userId, status: deleted.status });
    return deleted;
  }
}

module.exports = SubscriptionService;
