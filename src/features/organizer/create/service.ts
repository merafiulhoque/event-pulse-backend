import { hashPassword } from "../../../utils/bcrypt.js";
import { createJSON } from "../../../utils/globalHandler.js";
import { OrganizerCreateData } from "../types.js";
import { createOrganizer, findOrganizerByEmail } from "../organizerRepo.js";

export async function service(payload: OrganizerCreateData){
    const organizer = await findOrganizerByEmail(payload.email)
    if(!!organizer){
        return createJSON(false, `Email ${organizer.email} already exists`)
    }

    const hash = await hashPassword(payload.password)
    const newOrganizer = await createOrganizer({...payload, password: hash})
    return createJSON(true, `Email ${newOrganizer.email} registered successfully`)
}