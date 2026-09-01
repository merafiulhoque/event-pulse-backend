import { Request, Response, NextFunction } from "express";
import { ERR_UNAUTHORIZED, ERR_MALFORMED_TOKEN } from "../constants/http.js";
import { cfg } from "../cfg.js";
import { verifyToken } from "../utils/jwt.js";

export function getUser(req: Request, res: Response, next: NextFunction){

    const authHeader = req.headers.authorization


    if(!authHeader){
        const token = req.cookies?.[cfg.COOKIE_KEY]

        if(!token){
            return res.status(401).json(ERR_UNAUTHORIZED)
        }
        if(typeof token !== "string"){
            return res.status(401).json(ERR_MALFORMED_TOKEN)
        }
        req.user = verifyToken(token)
        return next()
    }

    const parts = authHeader.split(" ")

    if(parts.length === 2 && parts[0] === "Bearer"){
        const user = verifyToken(parts[1])
        req.user = user
        return next()
    }
    return res.status(401).json(ERR_MALFORMED_TOKEN)
}