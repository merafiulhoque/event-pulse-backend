import { Router } from "express";
import { asyncHandler, rateLimitHandler } from "../../utils/globalHandler";
import { controller as OrganizerCreateController } from "./create/controller";
import { controller as LoginController } from "./login/controller";
import rateLimit from "express-rate-limit";
import { getUser } from "../../middlewares/getUser";
import { verifyUserWIthDB } from "../../middlewares/verifyUserWithDB";
import { getOrganizer } from "./me/getOrganizer";

export const organizerRouter = Router()

const createLimit = rateLimit({
    limit: 10,
    windowMs: 60*1000, // 1 minute 
    handler: rateLimitHandler
})

const loginLimit = rateLimit({
    limit: 30,
    windowMs: 60*1000, // 1 minute
    handler: rateLimitHandler
})

const meLimit = rateLimit({
  limit: 60,
  windowMs: 60 * 1000,
  handler: rateLimitHandler,
});

organizerRouter.post("/create", createLimit, asyncHandler(OrganizerCreateController))
organizerRouter.post("/login", loginLimit, asyncHandler(LoginController))
organizerRouter.get("/me", meLimit, getUser, verifyUserWIthDB, asyncHandler(getOrganizer))