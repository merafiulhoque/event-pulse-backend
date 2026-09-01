import { JWT_PAYLOAD } from ".";

declare global{
    namespace Express {
        interface Request {
            user?: JWT_PAYLOAD
        }
    }
}