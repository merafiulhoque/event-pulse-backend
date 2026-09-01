import { hashPassword } from "../../../utils/bcrypt";
import { createJSON } from "../../../utils/globalHandler";
import { OrganizerCreateData } from "../types";
import { createOrganizer, findOrganizerByEmail } from "../organizerRepo";

export async function service(payload: OrganizerCreateData){
    const organizer = await findOrganizerByEmail(payload.email)
    if(!!organizer){
        return createJSON(false, `Email ${organizer.email} already exists`)
    }

    const hash = await hashPassword(payload.password)
    const newOrganizer = await createOrganizer({...payload, password: hash})
    return createJSON(true, `Email ${newOrganizer.email} registered successfully`)
}