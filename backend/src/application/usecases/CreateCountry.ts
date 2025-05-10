import { CountryRepository } from "../repositories/CountryRepository";

export class CreateCountry {
    constructor(private repo: CountryRepository) { }


    async execute(name: string) {
        return this.repo.create(name)
    }
}