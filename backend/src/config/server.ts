import "reflect-metadata"
import { createExpressServer } from "routing-controllers"
import { setupDependencyInjection } from "@/infrastructure/container"
import { CountryController } from "@/infrastructure/controllers/CountryController"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swaggerOptions"
import { connectRedis } from "@/infrastructure/redis"

export async function createApp() {
    setupDependencyInjection()

    await connectRedis()

    const app = createExpressServer({
        controllers: [CountryController],
        cors: true,
    })

    // Montar Swagger UI en /api-docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    return app
}
