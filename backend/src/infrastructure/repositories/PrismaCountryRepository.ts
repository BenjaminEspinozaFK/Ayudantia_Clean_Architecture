import { CountryRepository } from "@/domain/repositories/CountryRepository"
import { Country } from "@/domain/entities/Country"
import { prisma } from "../prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

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
    if (!name || name.trim() === "") {
      throw new Error("Country name cannot be empty.")
    }

    const existingCountry = await prisma.country.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    })

    if (existingCountry) {
      throw new Error("Country with this name already exists.")
    }

    const country = await prisma.country.create({ data: { name } })
    return new Country(country.id, country.name)
  }

  async update(id: string, name: string): Promise<Country | null> {
    if (!name || name.trim() === "") {
      throw new Error("Country name cannot be empty.")
    }

    const existingCountry = await prisma.country.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        id: {
          not: id,
        },
      },
    })

    if (existingCountry) {
      throw new Error("Another country with this name already exists.")
    }

    try {
      const updated = await prisma.country.update({
        where: { id },
        data: { name },
      })
      return new Country(updated.id, updated.name)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error("Country not found")
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.country.delete({
        where: { id },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error("Country not found")
      }
      throw error
    }
  }

}
