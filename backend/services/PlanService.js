const PlanRepository = require('../repositories/PlanRepository');
const AppError = require('../utils/AppError');
const { PricingStrategyFactory } = require('../strategies/PricingStrategy');

class PlanService {
  constructor(planRepository = new PlanRepository()) {
    this.planRepository = planRepository;
  }

  async createPlan(data) {
    const { name, price, duration = 'monthly', features = [] } = data;
    if (!name || price === undefined || Number(price) < 0) {
      throw new AppError('Plan name and valid price are required', 400);
    }

    const strategy = PricingStrategyFactory.getStrategy(duration);
    const calculatedPrice = strategy.calculate(price);

    return this.planRepository.create({
      name,
      price: Number(price),
      calculatedPrice,
      duration,
      features: Array.isArray(features) ? features : String(features).split(',').map((f) => f.trim()).filter(Boolean),
      isActive: data.isActive !== false,
    });
  }

  async getPlans(includeInactive = false) {
    return includeInactive ? this.planRepository.findAll({}, { sort: { createdAt: -1 } }) : this.planRepository.findActivePlans();
  }

  async updatePlan(id, data) {
    if (data.price !== undefined && Number(data.price) < 0) {
      throw new AppError('Price cannot be negative', 400);
    }
    if (data.price !== undefined || data.duration !== undefined) {
      const existing = await this.planRepository.findById(id);
      if (!existing) throw new AppError('Plan not found', 404);
      const duration = data.duration || existing.duration;
      const price = data.price !== undefined ? data.price : existing.price;
      data.calculatedPrice = PricingStrategyFactory.getStrategy(duration).calculate(price);
    }

    const updated = await this.planRepository.updateById(id, data);
    if (!updated) throw new AppError('Plan not found', 404);
    return updated;
  }

  async deletePlan(id) {
    const deleted = await this.planRepository.deleteById(id);
    if (!deleted) throw new AppError('Plan not found', 404);
    return deleted;
  }
}

module.exports = PlanService;
