import type { RequestHandler, Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { Prisma } from "../../generated/prisma/client"

export const asyncHandler = (handler: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    if (err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"){
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        })
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong" + err.stack
    })
}

export class AppError extends Error {
    constructor(public statusCode: number = 500, message: string){
        super(message)
        this.name = "AppError"
    }
}


export function createJSON(success: boolean, message: string): {success: boolean, message: string}

export function createJSON<T>(success: boolean, message: string, data: T): {success: boolean, message: string, data: T}

export function createJSON<T>(success: boolean, message: string, data?: T){
    return data !== undefined ? {success, message, data} : {success, message}
}

export const rateLimitHandler = (_req: Request, res: Response) => {
    return res.status(429).json({
        success: false,
        message: "Too many request, Please try again later"
    })
}