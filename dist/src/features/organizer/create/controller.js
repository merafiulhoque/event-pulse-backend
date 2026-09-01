import { OrganizerCreateSchema } from "../types.js";
import { service } from "./service.js";
import { validateSchema } from "../../../utils/zodValidation.js";
export async function controller(req, res) {
    const payload = req.body;
    const data = validateSchema(payload, OrganizerCreateSchema);
    const response = await service(data);
    return res
        .status(response.success ? 409 : 200)
        .json(response);
}
