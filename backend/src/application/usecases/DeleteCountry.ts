import { CountryRepository } from "../repositories/CountryRepository"

export class DeleteCountry {
    constructor(private repo: CountryRepository) { }

    async execute(id: string) {
        return this.repo.delete(id)
    }
}
