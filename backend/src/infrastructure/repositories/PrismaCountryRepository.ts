import { CountryRepository } from "../../domain/repositories/CountryRepository"
import { Country } from "../../domain/entities/Country"
import { prisma } from "../prisma/client"

export class PrismaCountryRepository implements CountryRepository {

  async getAll(): Promise<Country[]> {
    const countries = await prisma.country.findMany()
    return countries.map(c => new Country(c.id, c.name))
  }

  async getById(id: string): Promise<Country | null> {
    const country = await prisma.country.findUnique({ where: { id } })
    if (!country) return null
    return new Country(country.id, country.name)
  }

  async create(name: string): Promise<Country> {
    const country = await prisma.country.create({ data: { name } })
    return new Country(country.id, country.name)
  }

  async update(id: string, name: string): Promise<Country | null> {
    const updated = await prisma.country.update({
      where: { id },
      data: { name },
    })
    return new Country(updated.id, updated.name)
  }

  async delete(id: string): Promise<void> {
    await prisma.country.delete({
      where: { id },
    })
  }

}
