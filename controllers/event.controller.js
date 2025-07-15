import prisma from "../database/db.js";
import { ApiError, handleAsync } from "../middlewares/error.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createEvent = handleAsync(async (req, res) => {
  const { title, datetime, location, capacity } = req.validated;

  const event = await prisma.event.create({
    data: {
      title,
      datetime,
      location,
      capacity,
    },
  });

  return new ApiResponse(201, "Event created successfully", {
    eventId: event.id,
  }).send(res);
});

export const getEventDetails = handleAsync(async (req, res) => {
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
    include: {
      registrations: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!event) {
    throw new ApiError(404, "No event found with this event ID");
  }

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

  const { name, email } = req.validated;

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

  if (Date.now() > new Date(event.datetime).getTime()) {
    throw new ApiError(400, "Cannot register for past event");
  }

  const totalRegisteredUser = await prisma.registration.count({
    where: { eventId },
  });

  if (totalRegisteredUser >= event.capacity) {
    throw new ApiError(400, "Event is full");
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { name, email },
    });
  }

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
