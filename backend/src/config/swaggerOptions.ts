import swaggerJsdoc from "swagger-jsdoc";
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
                url: "http://localhost:3000", // Cambia el puerto si usas otro
            },
        ],
    },
    apis: ["./src/infrastructure/controllers/*.ts"], // Ajusta la ruta si es necesario
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
