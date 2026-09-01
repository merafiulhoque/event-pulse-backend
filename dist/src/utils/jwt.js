import jwt from "jsonwebtoken";
import { cfg } from "../cfg.js";
import { AppError } from "./globalHandler.js";
export function generateToken(data) {
    const token = jwt.sign(data, cfg.JWT_SECRET_KEY, {
        expiresIn: "1h"
    });
    return token;
}
export function verifyToken(token) {
    const data = jwt.verify(token, cfg.JWT_SECRET_KEY);
    if (typeof data === "string") {
        throw new AppError(403, "Invalid Token");
    }
    return data;
}
