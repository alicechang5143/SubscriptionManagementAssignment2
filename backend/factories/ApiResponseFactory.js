class ApiResponseFactory {
  static success(res, statusCode, message, data = null) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res, statusCode, message, details = null) {
    return res.status(statusCode).json({ success: false, message, details });
  }
}

module.exports = ApiResponseFactory;
