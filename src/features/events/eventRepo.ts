import { prisma } from "../../lib/prisma.js";
import { EVENT, EVENTS } from "./types.js";

export async function getEventsByUserId(organizerId: number){
    const events = await prisma.event.findMany({
        where: {organizerId}
    })
    return events
}

export async function getEventByNamePlaceOrganizerId(organizerId: number, name: string, place: string, date: Date){
    const events = await prisma.event.findMany({
        where: {
            organizerId,
            name,
            place,
            date
        },
        select: {name: true}
    })
    return events
}

export async function createEvent(organizerId: number, data: EVENT){
    const newEvent = await prisma.event.create({
        data: {
            organizerId,
            ...data
        }
    })
    return newEvent
}

export async function getUpcomingEvents(): Promise<EVENTS[]>{

    const upcomingEvents = await prisma.event.findMany({
        where: {
            date: {
                gte: new Date()
            }
        }
    })
    return upcomingEvents
}