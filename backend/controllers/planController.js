const PlanService = require('../services/PlanService');
const ApiResponseFactory = require('../factories/ApiResponseFactory');

const planService = new PlanService();

exports.createPlan = async (req, res, next) => {
  try {
    const plan = await planService.createPlan(req.body);
    return ApiResponseFactory.success(res, 201, 'Plan created', plan);
  } catch (error) {
    next(error);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === 'true' && req.user?.role === 'admin';
    const plans = await planService.getPlans(includeInactive);
    return ApiResponseFactory.success(res, 200, 'Plans fetched', plans);
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await planService.updatePlan(req.params.id, req.body);
    return ApiResponseFactory.success(res, 200, 'Plan updated', plan);
  } catch (error) {
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    await planService.deletePlan(req.params.id);
    return ApiResponseFactory.success(res, 200, 'Plan deleted');
  } catch (error) {
    next(error);
  }
};
