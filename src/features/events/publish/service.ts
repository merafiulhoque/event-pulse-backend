import { ApiResponse } from "../../../types/httpTypes.js";
import { createJSON } from "../../../utils/globalHandler.js";
import { createEvent, getEventByNamePlaceOrganizerId } from "../eventRepo.js";
import { EVENT, EVENTS } from "../types.js";

export async function service(organizerId: number, data: EVENT) : Promise<ApiResponse<EVENTS>>{
    const events = await getEventByNamePlaceOrganizerId(organizerId, data.name, data.place, data.date)
    if(events.length > 0 ){
        return createJSON(false, "Same event already published")
    }

    const newEvent: EVENTS = await createEvent(organizerId, data)
    return createJSON<EVENTS>(true, "Event published successfully", newEvent)
}