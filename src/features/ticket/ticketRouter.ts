import { Router } from "express";
import { asyncHandler, rateLimitHandler } from "../../utils/globalHandler";
import { availabilityController } from "./checkAvailabality/controller";
import { bookTicket } from "./book/controller";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../../lib/redis";
import { downloadPdfController } from "./download/controller";

export const createTicketRouter = () => {
    const ticketRouter = Router()

    const bookingLimit = rateLimit({
        limit: 10,
        windowMs: 1*60*1000, // 1 Minute
        standardHeaders: true,
        legacyHeaders: false,
        handler: rateLimitHandler,
        store: new RedisStore({
            sendCommand: (...args: string[]) => redis.sendCommand(args)
        })
    })

    ticketRouter.get("/:id/availability", asyncHandler(availabilityController))
    ticketRouter.post("/:id/book", bookingLimit,asyncHandler(bookTicket))
    ticketRouter.get("/download/:id/pdf", asyncHandler(downloadPdfController))
    return ticketRouter
}

