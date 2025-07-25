
// this is the custom class for sending consistent error response
export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode < 500 ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

// this is try catch handler, means we don't need to write every time trycatch block
export const handleAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// this is global error handler and this is used for also sendig consistent error response, it called when next(error) or we throw ApiError()
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (err.isOperational || process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: status,
      statusCode: statusCode,
      message: err.message,
      errors: err.errors,
      success: err.success,
    });
  } else {
    res.status(statusCode).json({
      status: "error",
      message: "something went wrong",
      success: false,
    });
  }
};
