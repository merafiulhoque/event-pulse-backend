import { prisma } from "../../lib/prisma.js";
import { OrganizerCreateData } from "./types.js";

export async function findOrganizerByEmail(email: string){
    const organizer = await prisma.organizer.findUnique({
        where: {email},
        select: {email: true}
    })
    return organizer
}

export async function createOrganizer(payload: OrganizerCreateData){
    const newOrganizer = await prisma.organizer.create({
        data: {...payload},
        select: {email: true}
    })
    return newOrganizer
}

export async function findOrganizerForLogin(email: string){
    const organizer = await prisma.organizer.findUnique({
        where: {email},
        select: {email: true,id: true, name: true, password: true}
    })
    return organizer
}