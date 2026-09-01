import { Request, Response } from "express";
import { ERR_UNAUTHORIZED } from "../../../constants/http";
import { createJSON } from "../../../utils/globalHandler";
import { JWT_PAYLOAD } from "../../../types";

export async function getOrganizer(req: Request, res: Response){
    const dbVerifiedUser = req.user

    if(!dbVerifiedUser){
        return res.status(401).json(ERR_UNAUTHORIZED)
    }

    return res.status(200).json(
        createJSON<JWT_PAYLOAD>(
            true,
            "Organizer details fetched successfully",
            dbVerifiedUser
        )
    )
}