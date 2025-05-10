import { CountryRepository } from "../repositories/CountryRepository"

export class GetAllCountries {
  constructor(private repo: CountryRepository) { }

  async execute() {
    return this.repo.getAll()
  }
}
