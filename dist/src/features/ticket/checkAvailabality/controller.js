import { service } from "./service.js";
import { createJSON } from "../../../utils/globalHandler.js";
export async function availabilityController(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res
            .status(400)
            .json(createJSON(false, "Invalid Request"));
    }
    const serviceResponse = await service(id);
    return res
        .status(200)
        .json(serviceResponse);
}
