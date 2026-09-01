import { EventCreateSchema } from "../types.js";
import { validateSchema } from "../../../utils/zodValidation.js";
import { ERR_UNAUTHORIZED } from "../../../constants/http.js";
import { service } from "./service.js";
import { redis } from "../../../lib/redis.js";
import { REDIS_KEYS } from "../../../constants/redisKeys.js";
export async function eventPublishController(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json(ERR_UNAUTHORIZED);
    }
    const data = req.body;
    const validatedData = validateSchema(data, EventCreateSchema);
    const formattedData = getDBEntryReadyData(validatedData);
    const serviceResponse = await service(user.id, formattedData);
    if (serviceResponse.success) {
        await redis.del(REDIS_KEYS.ALL_UPCOMING_EVENTS);
    }
    return res
        .status(serviceResponse.success ? 201 : 409)
        .json(serviceResponse);
}
function getDBEntryReadyData(input) {
    return {
        name: input.name,
        place: input.place,
        date: new Date(`${input.date}T${input.time}`),
        capacity: input.capacity,
        bookingStart: new Date(`${input.bookingStartDate}T${input.bookingStartTime}`),
        bookingEnd: new Date(`${input.bookingEndDate}T${input.bookingEndTime}`),
    };
}
