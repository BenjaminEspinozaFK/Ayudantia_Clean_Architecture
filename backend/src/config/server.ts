import "reflect-metadata"
import express, { Express, Request, Response, NextFunction } from "express"
import { setupDependencyInjection } from "@/infrastructure/container"
import { connectRedis } from "@/infrastructure/redis"
import { useExpressServer } from "routing-controllers"
import { CountryController } from "@/infrastructure/controllers/CountryController"

// Global error handler middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log error stack for debugging

  if (err.message === "Country name cannot be empty." ||
      err.message === "Country with this name already exists." ||
      err.message === "Another country with this name already exists.") {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Country not found") {
    return res.status(404).json({ error: err.message });
  }

  // Default to 500 server error
  return res.status(500).json({ error: "An unexpected error occurred" });
};

export async function createApp(): Promise<Express> {
    setupDependencyInjection()

    await connectRedis()

    const app = express()

    // Middleware to parse JSON bodies
    app.use(express.json());

    useExpressServer(app, {
        controllers: [CountryController],
        cors: true
    })

    // Register the error handling middleware LAST
    app.use(errorHandler);

    return app
}
