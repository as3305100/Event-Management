import { ApiError } from "../middlewares/error.middleware.js";

// this is the validate function which can validate req.body it is used is event.route.js file
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
