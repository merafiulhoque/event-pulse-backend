import { ApiResponse } from "../../../types/httpTypes";
import { createJSON } from "../../../utils/globalHandler";
import { createEvent, getEventByNamePlaceOrganizerId } from "../eventRepo";
import { EVENT, EVENTS } from "../types";

export async function service(organizerId: number, data: EVENT) : Promise<ApiResponse<EVENTS>>{
    const events = await getEventByNamePlaceOrganizerId(organizerId, data.name, data.place, data.date)
    if(events.length > 0 ){
        return createJSON(false, "Same event already published")
    }

    const newEvent: EVENTS = await createEvent(organizerId, data)
    return createJSON<EVENTS>(true, "Event published successfully", newEvent)
}