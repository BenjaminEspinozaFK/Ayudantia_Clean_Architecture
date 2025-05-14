import { CountryRepository } from "@/domain/repositories/CountryRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export class DeleteCountry {
    constructor(@inject("CountryRepository") private repo: CountryRepository) { }

    async execute(id: string) {
        return this.repo.delete(id)
    }
}
