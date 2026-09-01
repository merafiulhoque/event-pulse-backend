import {PrismaClient} from "../../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { cfg } from "../cfg"


const adapter = new PrismaPg({
    connectionString: cfg.DATABASE_URL,
})

export const prisma = new PrismaClient({
    adapter,
})
