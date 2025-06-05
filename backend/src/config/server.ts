import "reflect-metadata"
import express from "express"
import { setupDependencyInjection } from "@/infrastructure/container"
import { connectRedis } from "@/infrastructure/redis"
import { useExpressServer } from "routing-controllers"
import { CountryController } from "@/infrastructure/controllers/CountryController"


export async function createApp() {
    setupDependencyInjection()

    await connectRedis()

    const app = express()

    useExpressServer(app, {
        controllers: [CountryController],
        cors: true
    })

    return app
}
