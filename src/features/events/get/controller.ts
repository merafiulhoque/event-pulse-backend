import { Request, Response } from "express";
import { ERR_UNAUTHORIZED } from "../../../constants/http";
import { getEventsByUserId } from "../eventRepo";
import { EVENTS } from "../types";
import { createJSON } from "../../../utils/globalHandler";


export async function getEvents(req: Request, res: Response){
    const user = req.user

    if(!user){
        return res.status(401).json(ERR_UNAUTHORIZED)
    }

    const events: EVENTS[] = await getEventsByUserId(user.id)
    return res.status(200).json(
        createJSON<EVENTS[]>(
            true,
            events.length > 0 ? "Events Fetched Successfully" : "You have No events ",
            events
        )
    )
}