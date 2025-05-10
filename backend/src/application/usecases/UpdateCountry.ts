import { CountryRepository } from "../repositories/CountryRepository"

export class UpdateCountry {
    constructor(private repo: CountryRepository) { }

    async execute(id: string, name: string) {
        return this.repo.update(id, name)
    }
}
