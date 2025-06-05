import { createApp } from "./config/server"
import { swaggerDocs } from "./config/swaggerOptions"

const PORT = Number(process.env.PORT) || 3000

createApp().then((app) => {
  swaggerDocs(app, PORT)


  app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto", PORT)
  })
}).catch((error) => {
  console.error("Error al iniciar el servidor:", error)
})
