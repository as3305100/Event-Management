import { Router } from "express";
import { validate } from "../utils/validateSchema.js";
import {
  createEventSchema,
  registerEventSchema,
  cancelRegistrationSchema,
} from "../middlewares/validation.middleware.js";
import {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelEventRegistration,
  getUpcomingEvent,
  getEventStats,
} from "../controllers/event.controller.js";

const router = Router();

router.post("/", validate(createEventSchema), createEvent);

router.get("/upcoming", getUpcomingEvent); // don't change the routing order if we change it then this route don't call, always getEventDetals route called

router.get("/:id/event-stats", getEventStats);

router.get("/:id", getEventDetails);

router.post("/:id/register", validate(registerEventSchema), registerForEvent);

router.post(
  "/:id/cancel",
  validate(cancelRegistrationSchema),
  cancelEventRegistration
);

export default router;
