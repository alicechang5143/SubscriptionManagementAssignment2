const ApiResponseFactory = require('../factories/ApiResponseFactory');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return ApiResponseFactory.error(res, 403, 'Admin access only');
};

module.exports = adminOnly;
