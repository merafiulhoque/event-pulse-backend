import { createClient } from "redis";
import { cfg } from "../cfg";

export const redis = createClient({
    url: cfg.NODE_ENV === "production" ? cfg.REDIS_URL : "redis://localhost:6379"
})

redis.on("error" , (err) => {
    console.error("REDIS ERR:: ", err)
})

export async function connectRedis(){
    if(!redis.isOpen){
        await redis.connect()
        console.log("REDIS : connected")
    }
}