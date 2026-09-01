import { getTicketDetails } from "../ticketRepo";
import { Ticket, TicketGenerationPayload } from "../types";

export const service = async (id: number) => {
    const ticket = await getTicketDetails(id)
    return ticket
}
