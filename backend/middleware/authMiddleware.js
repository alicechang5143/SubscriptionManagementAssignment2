const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const ApiResponseFactory = require('../factories/ApiResponseFactory');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponseFactory.error(res, 401, 'No token provided');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    const user = await new UserRepository().findSafeById(decoded.id);

    if (!user) return ApiResponseFactory.error(res, 401, 'User not found');

    req.user = user;
    return next();
  } catch (error) {
    return ApiResponseFactory.error(res, 401, 'Token failed');
  }
};

module.exports = protect;
