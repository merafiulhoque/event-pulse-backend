import z from "zod"
import { AppError } from "./globalHandler.js"

export const validateSchema = <T extends z.ZodType>(data: unknown, schema: T): z.infer<T> => {
    const result = schema.safeParse(data)

    if(!result.success) throw new AppError(422, "Invalid input")
    return result.data
}