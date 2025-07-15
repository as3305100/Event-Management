import { ApiError } from "../middlewares/error.middleware.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      const message = error?.details[0]?.message || "Validation Error";
      throw new ApiError(400, message);
    }

    req.validated = value;
    next();
  };
};
