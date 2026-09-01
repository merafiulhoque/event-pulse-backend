import { createJSON } from "../../../utils/globalHandler.js";
import { createBooking } from "../ticketRepo.js";
import { Ticket, ticketBookingData } from "../types.js";

export async function service(id: number, data: ticketBookingData, idempotencyKey: string){
    const [success, ticket]: [boolean, Ticket] = await createBooking(id, data, idempotencyKey)
    if (success) return createJSON<Ticket>(true, "Ticket Created Successfully", ticket)
    else return createJSON<Ticket>(false, "Ticket Already Processed", ticket)
}