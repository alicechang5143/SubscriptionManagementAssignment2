const ApiResponseFactory = require('../factories/ApiResponseFactory');

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return ApiResponseFactory.error(
    res,
    statusCode,
    err.message || 'Server error',
    process.env.NODE_ENV === 'production' ? null : err.details || err.stack
  );
};

module.exports = { notFound, errorHandler };
