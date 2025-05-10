import express from "express"
import cors from "cors"
import { countryRouter } from "../infrastructure/controllers/CountryController"

export const app = express()
app.use(cors())
app.use(express.json())
app.use("/countries", countryRouter)
