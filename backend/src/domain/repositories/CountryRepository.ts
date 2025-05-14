import { Country } from "@/domain/entities/Country"

export interface CountryRepository {
  getAll(): Promise<Country[]>
  getById(id: string): Promise<Country | null>
  create(name: string): Promise<Country>
  update(id: string, name: string): Promise<Country | null>
  delete(id: string): Promise<void>
}
