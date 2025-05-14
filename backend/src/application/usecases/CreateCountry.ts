import { CountryRepository } from "@/domain/repositories/CountryRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export class CreateCountry {
    constructor(@inject("CountryRepository") private repo: CountryRepository) { }


    async execute(name: string) {
        return this.repo.create(name)
    }
}