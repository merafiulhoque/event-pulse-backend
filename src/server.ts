import { createApp } from "./app.js";
import { cfg } from "./cfg.js";
import { connectRedis } from "./lib/redis.js";



async function startServer(){
    await connectRedis()
    
    const app = createApp()

    app.listen(cfg.PORT, () => {
        console.log(`SERVER: listening at localhost:${cfg.PORT}`)
    })  
}

startServer()