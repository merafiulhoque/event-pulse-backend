import { prisma } from "../../lib/prisma.js";
export async function getEventsByUserId(organizerId) {
    const events = await prisma.event.findMany({
        where: { organizerId }
    });
    return events;
}
export async function getEventByNamePlaceOrganizerId(organizerId, name, place, date) {
    const events = await prisma.event.findMany({
        where: {
            organizerId,
            name,
            place,
            date
        },
        select: { name: true }
    });
    return events;
}
export async function createEvent(organizerId, data) {
    const newEvent = await prisma.event.create({
        data: {
            organizerId,
            ...data
        }
    });
    return newEvent;
}
export async function getUpcomingEvents() {
    const upcomingEvents = await prisma.event.findMany({
        where: {
            date: {
                gte: new Date()
            }
        }
    });
    return upcomingEvents;
}
