import { Request, Response } from "express";
import { OrganizerCreateSchema } from "../types";
import { service } from "./service";
import { validateSchema } from "../../../utils/zodValidation";
export async function controller(req: Request, res: Response) {
    const payload: unknown = req.body
    const data = validateSchema(payload, OrganizerCreateSchema)
    const response = await service(data)

    return res
            .status(response.success ? 409 : 200)
            .json(response)
}