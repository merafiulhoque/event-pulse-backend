import express from "express";
import morgan from "morgan"
import { organizerRouter } from "./features/organizer/router.js";
import { createJSON, errorHandler, rateLimitHandler } from "./utils/globalHandler.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"
import { eventRouter } from "./features/events/eventRouter.js";
import { createTicketRouter } from "./features/ticket/ticketRouter.js";
import cors from "cors"
import helmet from "helmet";
import { cfg } from "./cfg.js";
export function createApp(){
    const app = express()
    app.set("trust proxy", false)
    
    //helmet
    app.use(helmet({
        hsts: {
            maxAge: 31536000, // 1 Year,
            includeSubDomains: true
        },
        noSniff: true,
        hidePoweredBy: true,
        frameguard: { action: "deny" },
        contentSecurityPolicy: false,

    }))

    //cors config
    app.use(cors({
        origin: [cfg.ALLOWED_ORIGIN],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
        maxAge: 86400 //1day
    }))

    // logging
    app.use(morgan("combined"))
    app.use(cookieParser())

    //express middleware
    app.use(express.json({limit: "50kb"}))
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

    app.use((req, res) => {
        return res.status(404).json(createJSON(false, "Not Found"))
    })
    app.use(errorHandler)

    return app
}
