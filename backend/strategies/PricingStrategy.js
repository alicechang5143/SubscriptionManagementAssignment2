class PricingStrategy {
  calculate(price) {
    return Number(price);
  }
}

class MonthlyPricingStrategy extends PricingStrategy {
  calculate(price) {
    return Number(price);
  }
}

class YearlyPricingStrategy extends PricingStrategy {
  calculate(price) {
    return Number(price) * 12 * 0.9;
  }
}

class PricingStrategyFactory {
  static getStrategy(duration) {
    if (duration === 'yearly') return new YearlyPricingStrategy();
    return new MonthlyPricingStrategy();
  }
}

module.exports = {
  PricingStrategy,
  MonthlyPricingStrategy,
  YearlyPricingStrategy,
  PricingStrategyFactory,
};
