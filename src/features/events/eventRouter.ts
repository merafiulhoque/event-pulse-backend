import { Router } from "express";
import { asyncHandler } from "../../utils/globalHandler.js";
import { getEvents } from "./get/controller.js";
import { getUser } from "../../middlewares/getUser.js";
import { eventPublishController } from "./publish/controller.js";
import { upcomingEventController } from "./upcomingEvents/controller.js";
import { controller } from "./get-live-events/controller.js";

export const eventRouter = Router()

eventRouter.get("/all", getUser, asyncHandler(getEvents))
eventRouter.get("/live", asyncHandler(controller))
eventRouter.post("/publish", getUser, asyncHandler(eventPublishController))
eventRouter.get("/upcoming-events", asyncHandler(upcomingEventController))