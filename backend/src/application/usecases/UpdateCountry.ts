import { CountryRepository } from "@/domain/repositories/CountryRepository"
import { injectable, inject } from "tsyringe"

@injectable()
export class UpdateCountry {
    constructor(@inject("CountryRepository") private repo: CountryRepository) { }

    async execute(id: string, name: string) {
        return this.repo.update(id, name)
    }
}
