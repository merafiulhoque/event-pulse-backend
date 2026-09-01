import express from "express";
import morgan from "morgan"
import { organizerRouter } from "./features/organizer/router";
import { errorHandler, rateLimitHandler } from "./utils/globalHandler";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"
import { eventRouter } from "./features/events/eventRouter";
import { createTicketRouter } from "./features/ticket/ticketRouter";

export function createApp(){
    const app = express()

    // logging
    app.use(morgan("dev"))
    app.use(cookieParser())

    //express middleware
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))


    //organizer router
    app.use("/api/auth/organizer", organizerRouter)

    // events router
    app.use("/api/event", eventRouter)

    //ticket router
    const ticketRouter = createTicketRouter()
    app.use("/api/ticket", ticketRouter)

    const pingLimiter = rateLimit({
        limit: 50,
        windowMs: 60*1000,
        handler: rateLimitHandler
    })

    app.head("/", pingLimiter,(req, res) => {
        res.status(200).send("OK")
    })


    app.use(errorHandler)

    return app
}
