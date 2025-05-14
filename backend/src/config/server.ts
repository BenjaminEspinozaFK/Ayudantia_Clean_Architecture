import "reflect-metadata"
import { createExpressServer } from "routing-controllers"
import { setupDependencyInjection } from "@/infrastructure/container"
import { CountryController } from "@/infrastructure/controllers/CountryController"

export function createApp() {
    setupDependencyInjection()
    return createExpressServer({
        controllers: [CountryController],
        cors: true,
    })
}
