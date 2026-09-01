import { Request, Response } from "express";
import { OrganizerLoginSchema } from "../types.js";
import { service } from "./service.js";
import { validateSchema } from "../../../utils/zodValidation.js";


export async function controller(req: Request, res: Response){
    const payload: unknown = req.body
    const data = validateSchema(payload, OrganizerLoginSchema)

    const response = await service(data)
    return res
            .status(response.success ? 200 : 401)
            .json(response)
}