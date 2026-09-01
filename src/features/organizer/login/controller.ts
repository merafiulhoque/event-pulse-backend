import { Request, Response } from "express";
import { OrganizerLoginSchema } from "../types";
import { service } from "./service";
import { validateSchema } from "../../../utils/zodValidation";


export async function controller(req: Request, res: Response){
    const payload: unknown = req.body
    const data = validateSchema(payload, OrganizerLoginSchema)

    const response = await service(data)
    return res
            .status(response.success ? 200 : 401)
            .json(response)
}