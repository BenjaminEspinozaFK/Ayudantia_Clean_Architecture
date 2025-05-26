import { createClient } from "redis"

export const redisClient = createClient()

redisClient.on("error", (err) => {
    console.error("Redis error:", err)
})

export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect()
    }
}
