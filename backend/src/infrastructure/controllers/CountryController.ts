import { Response } from "express"
import { GetAllCountries } from "@/application/usecases/GetAllCountries"
import { GetCountryById } from "@/application/usecases/GetCountryById"
import { CreateCountry } from "@/application/usecases/CreateCountry"
import { UpdateCountry } from "@/application/usecases/UpdateCountry"
import { DeleteCountry } from "@/application/usecases/DeleteCountry"
import { injectable, inject } from "tsyringe"
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  HttpCode,
} from "routing-controllers"
import { redisClient } from "@/infrastructure/redis"

@injectable()
@JsonController("/countries")
export class CountryController {
  constructor(
    @inject("GetAllCountries") private getAllUseCase: GetAllCountries,
    @inject("GetCountryById") private getCountryByIdUseCase: GetCountryById,
    @inject("CreateCountry") private createCountryUseCase: CreateCountry,
    @inject("UpdateCountry") private updateCountryUseCase: UpdateCountry,
    @inject("DeleteCountry") private deleteCountryUseCase: DeleteCountry
  ) { }

  /**
   * @swagger
   * /countries:
   *   get:
   *     summary: Obtener todos los países
   *     tags: [Countries]
   *     responses:
   *       200:
   *         description: Lista de países
   */
  @Get("/")
  async getAllCountries(@Res() res: Response) {
    const cacheKey = "countries:all"
    const cached = await redisClient.get(cacheKey)

    if (cached) return res.json(JSON.parse(cached))

    const countries = await this.getAllUseCase.execute()
    await redisClient.set(cacheKey, JSON.stringify(countries), { EX: 60 })

    return res.json(countries)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   get:
   *     summary: Obtener un país por ID
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID del país
   *     responses:
   *       200:
   *         description: País encontrado
   *       404:
   *         description: País no encontrado
   */
  @Get("/:id")
  async getByIdCountry(@Param("id") id: string, @Res() res: Response) {
    const country = await this.getCountryByIdUseCase.execute(id)
    if (!country) return res.status(404).json({ error: "País no encontrado" })
    return res.json(country)
  }

  /**
   * @swagger
   * /countries:
   *   post:
   *     summary: Crear un nuevo país
   *     tags: [Countries]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: País creado
   */
  @Post("/")
  @HttpCode(201)
  async createCountry(@Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const created = await this.createCountryUseCase.execute(body.name)
    await redisClient.del("countries:all")
    return res.json(created)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   put:
   *     summary: Actualizar un país existente
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: País actualizado
   *       404:
   *         description: País no encontrado
   */
  @Put("/:id")
  async updateCountry(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const updated = await this.updateCountryUseCase.execute(id, body.name)
    if (!updated) return res.status(404).json({ error: "País no encontrado" })
    await redisClient.del("countries:all")
    return res.json(updated)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   delete:
   *     summary: Eliminar un país
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       204:
   *         description: País eliminado
   *       404:
   *         description: País no encontrado
   */
  @Delete("/:id")
  @HttpCode(204)
  async deleteCountry(@Param("id") id: string, @Res() res: Response) {
    try {
      await this.deleteCountryUseCase.execute(id)
      await redisClient.del("countries:all")
      return res.send()
    } catch {
      return res.status(404).json({ error: "País no encontrado" })
    }
  }
}