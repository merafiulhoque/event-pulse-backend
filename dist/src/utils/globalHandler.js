import { Prisma } from "../generated/prisma/client.js";
export const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }
    return res.status(500).json({
        success: false,
        message: "Something went wrong" + err.stack
    });
};
export class AppError extends Error {
    statusCode;
    constructor(statusCode = 500, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export function createJSON(success, message, data) {
    return data !== undefined ? { success, message, data } : { success, message };
}
export const rateLimitHandler = (_req, res) => {
    return res.status(429).json({
        success: false,
        message: "Too many request, Please try again later"
    });
};
