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

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API para gestionar países
 */

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
   *     summary: Obtiene todos los países
   *     tags: [Countries]
   *     responses:
   *       200:
   *         description: Lista de países
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "123"
   *                   name:
   *                     type: string
   *                     example: "Chile"
   */
  @Get("/")
  async getAllCountries(@Res() res: Response) {
    const countries = await this.getAllUseCase.execute()
    return res.json(countries)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   get:
   *     summary: Obtiene un país por ID
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del país
   *     responses:
   *       200:
   *         description: País encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "123"
   *                 name:
   *                   type: string
   *                   example: "Chile"
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
   *     summary: Crea un país nuevo
   *     tags: [Countries]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Argentina"
   *     responses:
   *       201:
   *         description: País creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "124"
   *                 name:
   *                   type: string
   *                   example: "Argentina"
   *       400:
   *         description: Falta el nombre
   */
  @Post("/")
  @HttpCode(201)
  async createCountry(@Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const created = await this.createCountryUseCase.execute(body.name)
    return res.json(created)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   put:
   *     summary: Actualiza un país existente
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del país a actualizar
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Uruguay"
   *     responses:
   *       200:
   *         description: País actualizado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "123"
   *                 name:
   *                   type: string
   *                   example: "Uruguay"
   *       400:
   *         description: Falta el nombre
   *       404:
   *         description: País no encontrado
   */
  @Put("/:id")
  async updateCountry(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const updated = await this.updateCountryUseCase.execute(id, body.name)
    if (!updated) return res.status(404).json({ error: "País no encontrado" })
    return res.json(updated)
  }

  /**
   * @swagger
   * /countries/{id}:
   *   delete:
   *     summary: Elimina un país por ID
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del país a eliminar
   *     responses:
   *       204:
   *         description: País eliminado correctamente
   *       404:
   *         description: País no encontrado
   */
  @Delete("/:id")
  @HttpCode(204)
  async deleteCountry(@Param("id") id: string, @Res() res: Response) {
    try {
      await this.deleteCountryUseCase.execute(id)
      return res.send()
    } catch {
      return res.status(404).json({ error: "País no encontrado" })
    }
  }
}
