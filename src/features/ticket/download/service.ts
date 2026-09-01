import { getTicketDetails } from "../ticketRepo.js";
import { Ticket, TicketGenerationPayload } from "../types.js";

export const service = async (id: number) => {
    const ticket = await getTicketDetails(id)
    return ticket
}
