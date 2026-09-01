import { Request, Response } from "express";
import { service } from "./service.js";
import { createJSON } from "../../../utils/globalHandler.js";

export async function availabilityController(
  req: Request,
  res: Response
) {
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