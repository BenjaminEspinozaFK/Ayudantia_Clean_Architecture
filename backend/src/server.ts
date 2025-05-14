import { createApp } from "./config/server"

const PORT = process.env.PORT || 3000

createApp().listen(PORT, () => {
  console.log("Server running on port", PORT)
})
