import { generateTicketPDF } from "./generatePdf.js";
import { service } from "./service.js";
import { Request, Response } from "express";
import { ERR_INVALID_REQUEST } from "../../../constants/http.js";
import { cfg } from "../../../cfg.js";

export async function downloadPdfController(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json(ERR_INVALID_REQUEST);
    }

    const ticket = await service(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ticket_${id}.pdf`);

    const host = cfg.ALLOWED_ORIGIN
    
    // Pass it to your async PDF generator
    const doc = await generateTicketPDF(ticket, host);

    doc.pipe(res);
    doc.end();
}