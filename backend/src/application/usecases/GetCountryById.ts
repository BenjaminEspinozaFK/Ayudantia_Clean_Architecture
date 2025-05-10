import { CountryRepository } from "../repositories/CountryRepository";

export class GetCountryById {
    constructor(private repo: CountryRepository) { }


    async execute(id: string) {
        return this.repo.getById(id)
    }
}