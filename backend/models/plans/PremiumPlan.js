class PremiumPlan {
  constructor() {
    this.type = 'premium';
    this.displayName = 'Premium Plan';
    this.maxSubscriptions = 5;
    this.supportLevel = 'priority email';
  }

  getPermissions() {
    return {
      canAccessPremiumContent: true,
      canExportData: true,
      canAddMultipleUsers: false,
    };
  }

  getSummary() {
    return `${this.displayName}: Up to 5 subscriptions, priority email support.`;
  }
}

module.exports = PremiumPlan;