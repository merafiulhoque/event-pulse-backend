import { comparePassword } from "../../../utils/bcrypt";
import { createJSON } from "../../../utils/globalHandler";
import { generateToken } from "../../../utils/jwt";
import { findOrganizerForLogin } from "../organizerRepo";
import { OrganizerLoginData } from "../types";

export async function service(data: OrganizerLoginData){
    const organizer = await findOrganizerForLogin(data.email)

    if(!organizer){
        return createJSON(false, `Invalid credentials`)
    }

    const isPassValid = await comparePassword(data.password, organizer.password)

    if(!isPassValid){
        return createJSON(false, "Invalid credentials")
    }
    const {password, ...payload} = organizer
    const token = generateToken(payload)

    return createJSON<string>(true, "Login successfull", token)

}