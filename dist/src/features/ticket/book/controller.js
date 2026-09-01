import { TicketBookingSchema } from "../types.js";
import { AppError, createJSON } from "../../../utils/globalHandler.js";
import { validateSchema } from "../../../utils/zodValidation.js";
import { service } from "./service.js";
export async function bookTicket(req, res) {
    const idempotencyKey = req.header("Idempotency-Key");
    if (!idempotencyKey)
        throw new AppError(400, "Idempotency key is required");
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res
            .status(400)
            .json(createJSON(false, "Invalid Request"));
    }
    const data = req.body;
    const validatedData = validateSchema(data, TicketBookingSchema);
    const serviceResponse = await service(id, validatedData, idempotencyKey);
    return res
        .status(serviceResponse.success ? 201 : 200)
        .json(serviceResponse);
}
