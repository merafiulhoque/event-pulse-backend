import { Router } from "express";
import { asyncHandler } from "../../utils/globalHandler";
import { getEvents } from "./get/controller";
import { getUser } from "../../middlewares/getUser";
import { eventPublishController } from "./publish/controller";
import { upcomingEventController } from "./upcomingEvents/controller";

export const eventRouter = Router()

eventRouter.get("/all", getUser, asyncHandler(getEvents))
eventRouter.post("/publish", getUser, asyncHandler(eventPublishController))
eventRouter.get("/upcoming-events", asyncHandler(upcomingEventController))