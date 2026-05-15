class BasicPlan {
  constructor() {
    this.type = 'basic';
    this.displayName = 'Basic Plan';
    this.maxSubscriptions = 1;
    this.supportLevel = 'email';
  }

  getPermissions() {
    return {
      canAccessPremiumContent: false,
      canExportData: false,
      canAddMultipleUsers: false,
    };
  }

  getSummary() {
    return `${this.displayName}: Single subscription, email support only.`;
  }
}

module.exports = BasicPlan;