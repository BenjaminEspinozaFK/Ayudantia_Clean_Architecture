import "reflect-metadata"; // Suggested just in case, though likely not needed for direct instantiation
import { PrismaClient } from '@prisma/client';
import { PrismaCountryRepository } from './PrismaCountryRepository';
import { Country } from '@/domain/entities/Country';

const prisma = new PrismaClient();
let countryRepository: PrismaCountryRepository;

beforeAll(async () => {
  await prisma.$connect();
  countryRepository = new PrismaCountryRepository();
});

beforeEach(async () => {
  await prisma.country.deleteMany({});
});

afterAll(async () => {
  await prisma.country.deleteMany({});
  await prisma.$disconnect();
});

describe('PrismaCountryRepository', () => {
  describe('create', () => {
    it('should create a new country successfully', async () => {
      const countryName = 'Wonderland';
      const newCountry = await countryRepository.create(countryName);

      expect(newCountry).toBeInstanceOf(Country);
      expect(newCountry.name).toBe(countryName);
      expect(newCountry.id).toBeDefined();

      const dbCountry = await prisma.country.findUnique({ where: { id: newCountry.id } });
      expect(dbCountry).not.toBeNull();
      expect(dbCountry?.name).toBe(countryName);
    });

    it('should throw an error if name is empty', async () => {
      expect.assertions(1); // Ensures that the catch block is reached
      try {
        await countryRepository.create('');
      } catch (e: any) {
        expect(e.message).toBe('Country name cannot be empty.');
      }
    });

    it('should throw an error if name is only whitespace', async () => {
      expect.assertions(1);
      try {
        await countryRepository.create('   ');
      } catch (e: any) {
        expect(e.message).toBe('Country name cannot be empty.');
      }
    });

    it('should throw an error if country with the same name already exists (case-insensitive)', async () => {
      expect.assertions(1);
      await countryRepository.create('Existing Country');
      try {
        await countryRepository.create('existing country');
      } catch (e: any) {
        expect(e.message).toBe('Country with this name already exists.');
      }
    });
  });

  describe('delete', () => {
    it('should delete an existing country successfully', async () => {
      const createdCountry = await countryRepository.create('To Be Deleted');

      await countryRepository.delete(createdCountry.id);

      const dbCountry = await prisma.country.findUnique({ where: { id: createdCountry.id } });
      expect(dbCountry).toBeNull();
    });

    it('should throw an error when trying to delete a non-existent country', async () => {
      expect.assertions(1);
      try {
        await countryRepository.delete('non-existent-id');
      } catch (e: any) {
        expect(e.message).toBe('Country not found'); // This relies on the P2025 error handling
      }
    });
  });

  describe('getAll', () => {
    it('should return an empty array if no countries exist', async () => {
      const countries = await countryRepository.getAll();
      expect(countries).toEqual([]);
    });

    it('should return all created countries', async () => {
      const country1 = await countryRepository.create('Country A');
      const country2 = await countryRepository.create('Country B');

      const countries = await countryRepository.getAll();
      expect(countries).toHaveLength(2);
      expect(countries).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Country A', id: country1.id }),
        expect.objectContaining({ name: 'Country B', id: country2.id }),
      ]));
      // Check if they are instances of Country
      countries.forEach(country => expect(country).toBeInstanceOf(Country));
    });
  });

  describe('getById', () => {
    it('should return the country if found', async () => {
      const createdCountry = await countryRepository.create('Specific Country');
      const foundCountry = await countryRepository.getById(createdCountry.id);

      expect(foundCountry).not.toBeNull();
      expect(foundCountry).toBeInstanceOf(Country);
      expect(foundCountry?.id).toBe(createdCountry.id);
      expect(foundCountry?.name).toBe('Specific Country');
    });

    it('should return null if country not found', async () => {
      const foundCountry = await countryRepository.getById('non-existent-id');
      expect(foundCountry).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing country successfully', async () => {
      const createdCountry = await countryRepository.create('Original Name');
      const updatedName = 'Updated Name';

      const updatedCountry = await countryRepository.update(createdCountry.id, updatedName);

      expect(updatedCountry).not.toBeNull();
      expect(updatedCountry).toBeInstanceOf(Country);
      expect(updatedCountry?.id).toBe(createdCountry.id);
      expect(updatedCountry?.name).toBe(updatedName);

      const dbCountry = await prisma.country.findUnique({ where: { id: createdCountry.id } });
      expect(dbCountry?.name).toBe(updatedName);
    });

    it('should throw an error if updated name is empty', async () => {
      expect.assertions(1);
      const createdCountry = await countryRepository.create('Country C');
      try {
        await countryRepository.update(createdCountry.id, '');
      } catch (e: any) {
        expect(e.message).toBe('Country name cannot be empty.');
      }
    });

    it('should throw an error if updated name is only whitespace', async () => {
      expect.assertions(1);
      const createdCountry = await countryRepository.create('Country D');
      try {
        await countryRepository.update(createdCountry.id, '   ');
      } catch (e: any) {
        expect(e.message).toBe('Country name cannot be empty.');
      }
    });

    it('should throw an error if another country with the same name already exists (case-insensitive)', async () => {
      expect.assertions(1);
      await countryRepository.create('Existing Name');
      const countryToUpdate = await countryRepository.create('Unique Name');

      try {
        await countryRepository.update(countryToUpdate.id, 'existing name');
      } catch (e: any) {
        expect(e.message).toBe('Another country with this name already exists.');
      }
    });

    it('should allow update if name is the same as current (case-insensitive)', async () => {
        const countryName = 'Case Test';
        const createdCountry = await countryRepository.create(countryName);
        const updatedCountry = await countryRepository.update(createdCountry.id, 'case test');
        expect(updatedCountry?.name).toBe('case test');
    });

    it('should throw an error when trying to update a non-existent country', async () => {
      expect.assertions(1);
      try {
        await countryRepository.update('non-existent-id', 'New Name');
      } catch (e: any) {
        expect(e.message).toBe('Country not found'); // This relies on the P2025 error handling
      }
    });
  });
});
