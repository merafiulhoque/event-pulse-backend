import { createClient } from "redis";
import { cfg } from "../cfg.js";

export const redis = createClient({
    url: cfg.REDIS_URL,
    socket: {
        reconnectStrategy: (retries, cause) => {
            if(retries > 10){
                return new Error("Too many reconnect retries")
            }
            return Math.min(retries*100, 3000)
        },
    }
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