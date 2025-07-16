import prisma from "../database/db.js";
import { ApiError, handleAsync } from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createEvent = handleAsync(async (req, res) => {
  // we applied validation throught middleware and this is validated data means it is trimmed
  const { title, datetime, location, capacity } = req.validated;

  // creating the event 
  const event = await prisma.event.create({
    data: {
      title,
      datetime,
      location,
      capacity,
    },
  });

  //  returning the response
  return new ApiResponse(201, "Event created successfully", {
    eventId: event.id,
  }).send(res);
});

export const getEventDetails = handleAsync(async (req, res) => {
  const eventId = req.params.id;

  // first we validating the eventId and if it is wrong it save's a database call
  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      eventId
    );
  if (!isValidUUID) {
    throw new ApiError(400, "Invalid event ID format");
  }

  // now we finding the event

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      registrations: {
        include: {
          user: true,
        },
      },
    },
  });

  // if event is not found, then through the error

  if (!event) {
    throw new ApiError(404, "No event found with this event ID");
  }

  // this is for sending the clear response
  const registeredUsers = event.registrations.map((register) => register.user);

  const responseData = {
    id: event.id,
    title: event.title,
    datetime: event.datetime,
    location: event.location,
    capacity: event.capacity,
    registeredUsers,
  };

  return new ApiResponse(
    200,
    "Event Details fetched successfully",
    responseData
  ).send(res);
});

export const registerForEvent = handleAsync(async (req, res) => {
  const eventId = req.params.id;

  // we are taking these two value because if the user is not existed the database, 
  // then we create the user, in this assingment user controller is not completed, because this is not mentioned in the assignment, we don't have a lot of time
  const { name, email } = req.validated;

  // validating eventId to save database call
  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      eventId
    );
  if (!isValidUUID) {
    throw new ApiError(400, "Invalid event ID format");
  }

  // finding the event 
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  //  checking we the event was over
  if (Date.now() > new Date(event.datetime).getTime()) {
    throw new ApiError(400, "Cannot register for past event");
  }
  // finding total reginstration for this event
  const totalRegisteredUser = await prisma.registration.count({
    where: { eventId },
  });

  // checking if the capacity is full
  if (totalRegisteredUser >= event.capacity) {
    throw new ApiError(400, "Event is full");
  }

  // checking if user is existed or not with this email
  let user = await prisma.user.findUnique({ where: { email } });

  // if not then create it
  if (!user) {
    user = await prisma.user.create({
      data: { name, email },
    });
  }

  // checking if the user already register for that event
  const userAlreadyRegistered = await prisma.registration.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
  });

  if (userAlreadyRegistered) {
    throw new ApiError(400, "User already registered for this event");
  }

  // now creating the user registration for this event
  const registration = await prisma.registration.create({
    data: {
      userId: user.id,
      eventId,
    },
  });

  return new ApiResponse(200, "User registered successfully", {
    registrationId: registration.id,
  }).send(res);
});

export const cancelEventRegistration = handleAsync(async (req, res) => {
  const eventId = req.params.id;

  const { email } = req.validated;

  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      eventId
    );
  if (!isValidUUID) {
    throw new ApiError(400, "Invalid event ID format");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const registration = await prisma.registration.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
  });

  if (!registration) {
    throw new ApiError(404, "User is not registered for this event");
  }

  await prisma.registration.delete({ where: { id: registration.id } });

  return new ApiResponse(200, "Registration cancel successfully").send(res);
});

export const getUpcomingEvent = handleAsync(async (req, res) => {
  console.log("Controller is called");
  const events = await prisma.event.findMany({
    where: {
      datetime: {
        gt: new Date(),
      },
    },
    orderBy: [{ datetime: "asc" }, { location: "asc" }],
  });

  return new ApiResponse(
    200,
    "Upcoming events data fetched successfully",
    events
  ).send(res);
});

export const getEventStats = handleAsync(async (req, res) => {
  const eventId = req.params.id;

  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      eventId
    );
  if (!isValidUUID) {
    throw new ApiError(400, "Invalid event ID format");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const totalRegistrations = await prisma.registration.count({
    where: { eventId },
  });

  const remainingCapacity = event.capacity - totalRegistrations;

  const percentageUsed = parseFloat(
    ((totalRegistrations / event.capacity) * 100).toFixed(2)
  );

  const responseData = {
    totalRegistrations,
    remainingCapacity,
    percentageUsed,
  };

  return new ApiResponse(
    200,
    "Event stats fetched successfully",
    responseData
  ).send(res);
});
