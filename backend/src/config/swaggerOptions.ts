import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import { Express } from "express";

//http://localhost:3000/api-docs
export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Países",
            version: "1.0.0",
            description: "API REST para gestión de países",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/infrastructure/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerDocs = (app: Express, port: number) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}