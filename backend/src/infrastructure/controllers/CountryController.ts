import express from "express"
import { PrismaCountryRepository } from "../repositories/PrismaCountryRepository"
import { GetAllCountries } from "../../application/usecases/GetAllCountries"
import { CreateCountry } from "../../application/usecases/CreateCountry"
import { GetCountryById } from "../../application/usecases/GetCountryById"
import { UpdateCountry } from "../../application/usecases/UpdateCountry"
import { DeleteCountry } from "../../application/usecases/DeleteCountry"

const repo = new PrismaCountryRepository()
const getAllCountries = new GetAllCountries(repo)
const getCountryById = new GetCountryById(repo)
const createCountry = new CreateCountry(repo)
const updateCountry = new UpdateCountry(repo)
const deleteCountry = new DeleteCountry(repo)

//GET /countries
//GET /countries/:id
//POST /countries
//PUT	/countries/:id
//DELETE	/countries/:id
export const countryRouter = express.Router()

// Obtenemos todos los Paises //
countryRouter.get("/", async (_req, res) => {
  const countries = await getAllCountries.execute()
  res.json(countries)
})

// Obtenemos paises por ID  //
countryRouter.get('/:id', async (req: any, res: any) => {
  const id = req.params.id

  if (!id) {
    return res.status(400).json({ error: "ID inválido" })
  }

  const country = await getCountryById.execute(id)

  if (!country) {
    return res.status(404).json({ error: "País no encontrado" })
  }

  res.json(country)
})

// Creamos un nuevo Pais //
countryRouter.post("/", async (req: any, res: any) => {

  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: "Falta el nombre del pais" })
  }

  const country = await createCountry.execute(name)
  res.status(201).json(country)
})

// Actualizar país
countryRouter.put("/:id", async (req: any, res: any) => {
  const id = req.params.id
  const { name } = req.body

  if (!id || !name) {
    return res.status(400).json({ error: "Datos inválidos" })
  }

  const updated = await updateCountry.execute(id, name)
  if (!updated) {
    return res.status(404).json({ error: "País no encontrado" })
  }

  res.json(updated)
})

// Eliminar país
countryRouter.delete("/:id", async (req: any, res: any) => {
  const id = req.params.id

  if (!id) {
    return res.status(400).json({ error: "ID inválido" })
  }

  try {
    await deleteCountry.execute(id)
    res.status(204).send()
  } catch (e) {
    res.status(404).json({ error: "País no encontrado" })
  }
})
