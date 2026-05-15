const facade = require('../facades/SubscriptionFacade');
const ApiResponseFactory = require('../factories/ApiResponseFactory');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await facade.getUserDashboard(req.user._id);
    return ApiResponseFactory.success(res, 200, 'Dashboard fetched', data);
  } catch (error) {
    next(error);
  }
};
