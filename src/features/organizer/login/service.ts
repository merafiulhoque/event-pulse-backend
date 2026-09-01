import { comparePassword } from "../../../utils/bcrypt.js";
import { createJSON } from "../../../utils/globalHandler.js";
import { generateToken } from "../../../utils/jwt.js";
import { findOrganizerForLogin } from "../organizerRepo.js";
import { OrganizerLoginData } from "../types.js";

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