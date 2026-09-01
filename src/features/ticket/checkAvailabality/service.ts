import { createJSON } from "../../../utils/globalHandler.js";
import { getEvent } from "../ticketRepo.js";

export async function service(id: number){
    const eventDetails = await getEvent(id)
    const nowTime = new Date()

    if(eventDetails.bookingStart >= nowTime) {
        return createJSON(false, "Booking Not Started Yet")
    }

    if(eventDetails.bookingEnd <= nowTime){
        return createJSON(false, "Booking is closed")
    }

    if(eventDetails.capacity <= eventDetails.ticketCount){
        return createJSON<number>(true, "HOUSE full, ticket booking Not allowed", 0)
    }
    const availableTickets = eventDetails.capacity - eventDetails.ticketCount
    return createJSON<number>(true, "Ticket availability fetched successfully", availableTickets)
}