const AuthService = require('../services/AuthService');
const PlanService = require('../services/PlanService');
const SubscriptionService = require('../services/SubscriptionService');

class SubscriptionFacade {
  constructor() {
    this.authService = new AuthService();
    this.planService = new PlanService();
    this.subscriptionService = new SubscriptionService();
  }

  // Combines registration + auto-subscribes user to a plan in one call
  async registerAndSubscribe({ name, email, password, university, address, planId }) {
    const userPayload = await this.authService.register({ name, email, password, university, address });
    const subscription = await this.subscriptionService.createSubscription(userPayload.id, planId);
    const plan = await this.planService.getPlans();

    return {
      user: userPayload,
      subscription,
      availablePlans: plan,
    };
  }

  // Gets everything needed for a user's dashboard in one call
  async getUserDashboard(userId) {
    const profile = await this.authService.getProfile(userId);
    const subscriptions = await this.subscriptionService.getUserSubscriptions(userId);
    const availablePlans = await this.planService.getPlans();

    return {
      profile,
      subscriptions,
      availablePlans,
    };
  }

  // Cancels subscription and returns updated profile in one call
  async cancelAndRefreshProfile(userId, subscriptionId) {
    const cancelled = await this.subscriptionService.cancelSubscription(userId, subscriptionId);
    const profile = await this.authService.getProfile(userId);

    return {
      cancelled,
      profile,
    };
  }
}

module.exports = new SubscriptionFacade();