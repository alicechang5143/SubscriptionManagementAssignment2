const BasicPlan = require('../models/plans/BasicPlan');
const PremiumPlan = require('../models/plans/PremiumPlan');
const EnterprisePlan = require('../models/plans/EnterprisePlan');

/**
 * Factory Pattern
 * Centralises the creation of subscription plan objects.
 * The caller only needs to provide a plan type string —
 * the factory decides which class to instantiate.
 */
class SubscriptionFactory {
  static createPlan(type) {
    switch (type.toLowerCase()) {
      case 'basic':
        return new BasicPlan();
      case 'premium':
        return new PremiumPlan();
      case 'enterprise':
        return new EnterprisePlan();
      default:
        throw new Error(`Unknown subscription plan type: "${type}"`);
    }
  }

  static getAvailableTypes() {
    return ['basic', 'premium', 'enterprise'];
  }
}

module.exports = SubscriptionFactory;