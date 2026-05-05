const BaseRepository = require('./BaseRepository');
const Plan = require('../models/Plan');

class PlanRepository extends BaseRepository {
  constructor() {
    super(Plan);
  }

  async findActivePlans() {
    return this.findAll({ isActive: true }, { sort: { createdAt: -1 } });
  }

  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = PlanRepository;
