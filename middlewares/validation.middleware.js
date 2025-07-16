import Joi from "joi";
import { eventField, userField } from "../utils/validationField.js";

// In this file we making the validation schema and used in event.route.js file


const createEventSchema = Joi.object({
  title: eventField.title,
  datetime: eventField.datetime,
  location: eventField.location,
  capacity: eventField.capacity,
});

const registerEventSchema = Joi.object({
  name: userField.name,
  email: userField.email,
});

const cancelRegistrationSchema = Joi.object({
  email: userField.email,
});

export { createEventSchema, registerEventSchema, cancelRegistrationSchema };
