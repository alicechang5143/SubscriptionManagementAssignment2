const AuthService = require('../services/AuthService');
const ApiResponseFactory = require('../factories/ApiResponseFactory');

const authService = new AuthService();

exports.registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return ApiResponseFactory.success(res, 201, 'Registration successful', user);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    return ApiResponseFactory.success(res, 200, 'Login successful', user);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user._id);
    return ApiResponseFactory.success(res, 200, 'Profile fetched', profile);
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    return ApiResponseFactory.success(res, 200, 'Profile updated', user);
  } catch (error) {
    next(error);
  }
};
