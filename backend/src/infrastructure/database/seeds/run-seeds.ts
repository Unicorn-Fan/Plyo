import { AppDataSource } from '../data-source';
import { seedCities } from './cities.seed';
import { seedBrokerOffices } from './broker-offices.seed';

async function runSeeds() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    await seedCities(AppDataSource);
    await seedBrokerOffices(AppDataSource);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runSeeds();

