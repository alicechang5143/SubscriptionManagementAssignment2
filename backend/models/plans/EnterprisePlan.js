class EnterprisePlan {
  constructor() {
    this.type = 'enterprise';
    this.displayName = 'Enterprise Plan';
    this.maxSubscriptions = Infinity;
    this.supportLevel = '24/7 dedicated';
  }

  getPermissions() {
    return {
      canAccessPremiumContent: true,
      canExportData: true,
      canAddMultipleUsers: true,
    };
  }

  getSummary() {
    return `${this.displayName}: Unlimited subscriptions, 24/7 dedicated support.`;
  }
}

module.exports = EnterprisePlan;