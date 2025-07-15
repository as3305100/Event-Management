import Joi from "joi";

export const eventField = {
  title: Joi.string().trim().min(3).required().messages({
    "any.required": "Title is required",
    "string.empty": "Title is required",
    "string.min": "Title length not less than 3 characters",
  }),
  datetime: Joi.date().iso().required().messages({
    "any.required": "Datetime is required",
    "date.base": "Datetime should be valid",
    "date.format": "Datetime should be in ISO format",
    "date.isoDate": "Datetime should be in ISO 8601 format",
  }),
  location: Joi.string().trim().min(3).required().messages({
    "any.required": "Location is required",
    "string.empty": "Location is required",
    "string.min": "Location length not less than 3 characters",
  }),
  capacity: Joi.number().min(1).max(1000).required().messages({
    "any.required": "Capacity is required",
    "number.base": "Capacity must be a number",
    "number.min": "Capacity not less than 1",
    "number.max": "Capacity can not exceed 1000",
  }),
};

export const userField = {
  name: Joi.string().trim().min(3).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
    "string.min": "Name length not less than 3 characters",
  }),
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "any.required": "Email is required",
      "string.pattern.base": "Please provide a valid email",
    }),
};
