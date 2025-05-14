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
//GET /countries
//GET /countries/:id
//POST /countries
//PUT	/countries/:id
//DELETE	/countries/:id
//Decorators
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

  @Get("/")
  async getAllCountries(@Res() res: Response) {
    const countries = await this.getAllUseCase.execute()
    return res.json(countries)
  }

  @Get("/:id")
  async getByIdCountry(@Param("id") id: string, @Res() res: Response) {
    const country = await this.getCountryByIdUseCase.execute(id)
    if (!country) return res.status(404).json({ error: "País no encontrado" })
    return res.json(country)
  }

  @Post("/")
  @HttpCode(201)
  async createCountry(@Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const created = await this.createCountryUseCase.execute(body.name)
    return res.json(created)
  }

  @Put("/:id")
  async updateCountry(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
    if (!body.name) return res.status(400).json({ error: "Falta el nombre" })
    const updated = await this.updateCountryUseCase.execute(id, body.name)
    if (!updated) return res.status(404).json({ error: "País no encontrado" })
    return res.json(updated)
  }

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