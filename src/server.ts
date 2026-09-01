import { createApp } from "./app";
import { cfg } from "./cfg";
import { connectRedis } from "./lib/redis";



async function startServer(){
    await connectRedis()
    
    const app = createApp()

    app.listen(cfg.PORT, () => {
        console.log(`SERVER: listening at localhost:${cfg.PORT}`)
    })  
}

startServer()