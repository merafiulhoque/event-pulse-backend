import { Request, Response } from "express";
import { getLiveEvents } from "../eventRepo.js";


export async function controller(req: Request, res: Response){
    const events = await getLiveEvents()
    console.log(events)
    return res
            .status(events.length > 0 ? 200 : 404)
            .json({data: events})
}