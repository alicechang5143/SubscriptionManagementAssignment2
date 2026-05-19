const SubscriptionService = require('../services/SubscriptionService');
const ApiResponseFactory = require('../factories/ApiResponseFactory');
const facade = require('../facades/SubscriptionFacade');

const subscriptionService = new SubscriptionService();

exports.createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.user._id, req.body.plan);
    return ApiResponseFactory.success(res, 201, 'Subscription created', subscription);
  } catch (error) {
    next(error);
  }
};

exports.getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await subscriptionService.getUserSubscriptions(req.user._id);
    return ApiResponseFactory.success(res, 200, 'Subscriptions fetched', subscriptions);
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.updateSubscription(req.user._id, req.params.id, req.body);
    return ApiResponseFactory.success(res, 200, 'Subscription updated', subscription);
  } catch (error) {
    next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const result = await facade.cancelAndRefreshProfile(req.user._id, req.params.id);
    return ApiResponseFactory.success(res, 200, 'Subscription cancelled', result);
  } catch (error) {
    next(error);
  }
};

exports.renewSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.renewSubscription(req.user._id, req.params.id);
    return ApiResponseFactory.success(res, 200, 'Subscription renewed', subscription);
  } catch (error) {
    next(error);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    await subscriptionService.deleteSubscription(req.user._id, req.params.id);
    return ApiResponseFactory.success(res, 200, 'Subscription removed');
  } catch (error) {
    next(error);
  }
};
