import { createJSON } from "../../../utils/globalHandler.js";
import { createBooking } from "../ticketRepo.js";
export async function service(id, data, idempotencyKey) {
    const [success, ticket] = await createBooking(id, data, idempotencyKey);
    if (success)
        return createJSON(true, "Ticket Created Successfully", ticket);
    else
        return createJSON(false, "Ticket Already Processed", ticket);
}
