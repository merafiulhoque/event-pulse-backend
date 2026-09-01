
import z from "zod"
import { EVENTS } from "../events/types"
import { Status } from "../../../generated/prisma/enums"

export type EVENT_WITH_TICKET_COUNT = Omit<EVENTS, "organizerId" | "createdAt" | "updatedAt"> & {
    ticketCount: number
    
}

export const TicketBookingSchema = z.object({
    name: z
            .string()
            .min(3, "Name must be minimum 3 character")
            .transform((name) =>
                name
                .split(/\s+/)
                .map(
                    (part) =>
                    part.charAt(0).toUpperCase() +
                    part.slice(1).toLowerCase()
                )
                .join(" ")
            ),

    email: z
            .string()
            .email("This is not a valid email")
            .trim()
            .toLowerCase(),

    phone: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Phone number must be exactly 10 digits"),
})


export type ticketBookingData = z.infer<typeof TicketBookingSchema>

export interface Ticket {
    name: string;
    email: string;
    phone: string;
    status: Status;
    idempotencyKey: string;
    id: number;
    eventId: number;
}

export interface TicketGenerationPayload {
    id: number;
    name: string;
    event: {
        name: string;
        place: string;
        date: Date;
    };
    email: string;
    phone: string;
    status: Status;
}