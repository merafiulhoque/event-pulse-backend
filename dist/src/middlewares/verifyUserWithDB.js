import { ERR_UNAUTHORIZED } from "../constants/http.js";
import { prisma } from "../lib/prisma.js";
export async function verifyUserWIthDB(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).json(ERR_UNAUTHORIZED);
    }
    const organizer = await prisma.organizer.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, name: true }
    });
    if (!organizer) {
        return res.status(401).json(ERR_UNAUTHORIZED);
    }
    req.user = organizer;
    return next();
}
