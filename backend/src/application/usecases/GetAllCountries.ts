import { CountryRepository } from "@/domain/repositories/CountryRepository"
import { injectable, inject } from "tsyringe"

@injectable()
export class GetAllCountries {
  constructor(@inject("CountryRepository") private repo: CountryRepository) { }

  async execute() {
    return this.repo.getAll()
  }
}
