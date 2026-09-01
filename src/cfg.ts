import dotenv from "dotenv"
dotenv.config({
    quiet: true
})

const ENV = process.env

export const cfg = {
    NODE_ENV: String(ENV.NODE_ENV!),
    ALLOWED_ORIGIN: String(ENV.ALLOWED_ORIGIN!),
    PORT: Number(ENV.PORT ?? 5000),
    DATABASE_URL: String(ENV.DATABASE_URL!),
    JWT_SECRET_KEY: String(ENV.JWT_SECRET_KEY!),
    COOKIE_KEY: String(ENV.COOKIE_KEY!),
    REDIS_URL: String(ENV.REDIS_URL!)
}