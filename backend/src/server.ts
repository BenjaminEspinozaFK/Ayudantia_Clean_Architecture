import { createApp } from "./config/server"

const PORT = process.env.PORT || 3000

createApp().then((app) => {
  app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto", PORT)
  })
}).catch((error) => {
  console.error("Error al iniciar el servidor:", error)
})
