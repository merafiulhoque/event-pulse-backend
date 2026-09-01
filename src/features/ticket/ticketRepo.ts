import { Ticket } from "../../generated/prisma/client.js";
import { Status } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/globalHandler.js";
import { ticketBookingData, TicketGenerationPayload } from "./types.js";

export async function getTicketAvailability(id: number){
    
}

export async function getEvent(id: number) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      place: true,
      date: true,
      bookingStart: true,
      bookingEnd: true,
      capacity: true,

      _count: {
        select: {
          tickets: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError(400, "Invalid Request");
  }

  return {
    ...event,
    ticketCount: event._count.tickets,
  };
}

export async function createBooking(id: number, data: ticketBookingData, idempotencyKey: string): Promise<[boolean, Ticket]>{
  return prisma.$transaction(async (tx) => {

    const ticketExists: Ticket | null = await tx.ticket.findUnique({
      where: {idempotencyKey}
    })

    if(!!ticketExists) return [false, ticketExists]

    const now = new Date()

    const event = await tx.$queryRaw<{
      id: number,
      capacity: number,
      bookingStart: Date,
      bookingEnd: Date
    }[]>`SELECT id, capacity, "bookingStart", "bookingEnd" from "Event" where id=${id} FOR UPDATE`

    if(!event[0]){
      throw new AppError(409, "Invalid Request")
    }
    const count = await tx.ticket.count({
      where: {eventId: id}
    })

    if(event[0].capacity <= count){
      throw new AppError(403, "Booking Not Allowed")
    }

    const ticket = await tx.ticket.create({
      data: {
        eventId: id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        idempotencyKey,
        status: Status.PENDING
      }
    })
    return [true, ticket]
  })
}

export async function getTicketDetails(id: number){
  const ticket: TicketGenerationPayload | null = await prisma.ticket.findUnique({
    where : {id},
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      status: true,
      event: {
        select: {
          name: true,
          place: true,
          date: true
        }
      },

    }
  })
  if(!ticket) throw new AppError(404, "Bad Request")
  return ticket
}