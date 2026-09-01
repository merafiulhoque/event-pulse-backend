import { Request, Response } from "express";
import { EVENT, EventCreateData, EventCreateSchema } from "../types";
import { validateSchema } from "../../../utils/zodValidation";
import { ERR_UNAUTHORIZED } from "../../../constants/http";
import { service } from "./service";
import { redis } from "../../../lib/redis";
import { REDIS_KEYS } from "../../../constants/redisKeys";

export async function eventPublishController(req: Request, res: Response){
    const user = req.user
    if(!user){
        return res.status(401).json(ERR_UNAUTHORIZED)
    }

    const data: unknown = req.body

    const validatedData = validateSchema(data, EventCreateSchema)
    const formattedData = getDBEntryReadyData(validatedData)
    const serviceResponse = await service(user.id, formattedData)
    if(serviceResponse.success){
        await redis.del(REDIS_KEYS.ALL_UPCOMING_EVENTS)
    }
    return res
            .status(serviceResponse.success ? 201 : 409)
            .json(serviceResponse)
}

function getDBEntryReadyData(input: EventCreateData): EVENT{
    return {
        name: input.name,
        place: input.place,
        date: new Date(`${input.date}T${input.time}`),
        capacity: input.capacity,
        bookingStart: new Date(
        `${input.bookingStartDate}T${input.bookingStartTime}`
        ),
        bookingEnd: new Date(
        `${input.bookingEndDate}T${input.bookingEndTime}`
        ),
    };
}