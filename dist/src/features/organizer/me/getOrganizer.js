import { ERR_UNAUTHORIZED } from "../../../constants/http.js";
import { createJSON } from "../../../utils/globalHandler.js";
export async function getOrganizer(req, res) {
    const dbVerifiedUser = req.user;
    if (!dbVerifiedUser) {
        return res.status(401).json(ERR_UNAUTHORIZED);
    }
    return res.status(200).json(createJSON(true, "Organizer details fetched successfully", dbVerifiedUser));
}
