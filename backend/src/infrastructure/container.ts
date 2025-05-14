import { container } from "tsyringe"
import { useContainer as routingUseContainer, IocAdapter } from "routing-controllers"
import { GetAllCountries } from "@/application/usecases/GetAllCountries"
import { GetCountryById } from "@/application/usecases/GetCountryById"
import { CreateCountry } from "@/application/usecases/CreateCountry"
import { UpdateCountry } from "@/application/usecases/UpdateCountry"
import { DeleteCountry } from "@/application/usecases/DeleteCountry"
import { CountryRepository } from "@/domain/repositories/CountryRepository"
import { PrismaCountryRepository } from "@/infrastructure/repositories/PrismaCountryRepository"

const adapter: IocAdapter = {
    get<T>(someClass: new (...args: any[]) => T): T {
        return container.resolve<T>(someClass)
    },
}

export function setupDependencyInjection() {
    container.register<CountryRepository>("CountryRepository", {
        useClass: PrismaCountryRepository,
    })
    container.register<GetAllCountries>("GetAllCountries", {
        useClass: GetAllCountries,
    })
    container.register<GetCountryById>("GetCountryById", {
        useClass: GetCountryById,
    })
    container.register<CreateCountry>("CreateCountry", {
        useClass: CreateCountry,
    })
    container.register<UpdateCountry>("UpdateCountry", {
        useClass: UpdateCountry,
    })
    container.register<DeleteCountry>("DeleteCountry", {
        useClass: DeleteCountry,
    })

    routingUseContainer(adapter)
}