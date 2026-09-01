import { createJSON } from "../../../utils/globalHandler.js";
import { createEvent, getEventByNamePlaceOrganizerId } from "../eventRepo.js";
export async function service(organizerId, data) {
    const events = await getEventByNamePlaceOrganizerId(organizerId, data.name, data.place, data.date);
    if (events.length > 0) {
        return createJSON(false, "Same event already published");
    }
    const newEvent = await createEvent(organizerId, data);
    return createJSON(true, "Event published successfully", newEvent);
}
