import { Request, Response } from "express";
import { getUpcomingEvents } from "../eventRepo";
import { createJSON } from "../../../utils/globalHandler";
import { EVENTS } from "../types";
import { redis } from "../../../lib/redis";
import { REDIS_KEYS } from "../../../constants/redisKeys";


export const upcomingEventController = async (req: Request, res: Response) => {

    const redisEntry = await redis.get(REDIS_KEYS.ALL_UPCOMING_EVENTS)

    if(!redisEntry){
        const upcomingEvents = await getUpcomingEvents()
        await redis.set(
            REDIS_KEYS.ALL_UPCOMING_EVENTS, 
            JSON.stringify(upcomingEvents),
            {
                expiration: {
                    type: "EX",
                    value: 10*60 // 10 minutes
                }
            }
        )
        return res.status(200).json(
            createJSON<EVENTS[]>(
                true,
                "Events fetched successfully",
                upcomingEvents.length > 0 ? upcomingEvents : []
            )
        )
    }
    const dataInRedis: EVENTS[] = await JSON.parse(redisEntry)
    return res.status(200).json(
            createJSON<EVENTS[]>(
                true,
                "Events fetched successfully",
                dataInRedis.length > 0 ? dataInRedis : []
            )
        )
    
}