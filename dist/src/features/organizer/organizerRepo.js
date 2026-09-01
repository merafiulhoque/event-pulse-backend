import { prisma } from "../../lib/prisma.js";
export async function findOrganizerByEmail(email) {
    const organizer = await prisma.organizer.findUnique({
        where: { email },
        select: { email: true }
    });
    return organizer;
}
export async function createOrganizer(payload) {
    const newOrganizer = await prisma.organizer.create({
        data: { ...payload },
        select: { email: true }
    });
    return newOrganizer;
}
export async function findOrganizerForLogin(email) {
    const organizer = await prisma.organizer.findUnique({
        where: { email },
        select: { email: true, id: true, name: true, password: true }
    });
    return organizer;
}
