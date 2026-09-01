import { getTicketDetails } from "../ticketRepo.js";
export const service = async (id) => {
    const ticket = await getTicketDetails(id);
    return ticket;
};
