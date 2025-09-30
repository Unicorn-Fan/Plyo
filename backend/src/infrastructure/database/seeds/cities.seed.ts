import { DataSource } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { NorwegianCitiesService } from '../../services/norwegian-cities.service';

export async function seedCities(dataSource: DataSource) {
  const cityRepository = dataSource.getRepository(CityEntity);
  const citiesService = new NorwegianCitiesService();

  console.log('Fetching Norwegian cities from API...');
  
  try {
    const norwegianCities = await citiesService.getNorwegianCities();
    
    console.log(`Found ${norwegianCities.length} cities from API`);

    for (const cityData of norwegianCities) {
      const existingCity = await cityRepository.findOne({
        where: { name: cityData.name }
      });

      if (!existingCity) {
        const city = cityRepository.create({
          name: cityData.name,
          region: cityData.region,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
        });

        await cityRepository.save(city);
        console.log(`Seeded city: ${cityData.name} (${cityData.region})`);
      } else {
        console.log(`City already exists: ${cityData.name}`);
      }
    }

    console.log('Cities seeding completed');
  } catch (error) {
    console.error('Error seeding cities:', error);
    console.log('Falling back to static data...');
    
    await seedCitiesStatic(cityRepository);
  }
}

async function seedCitiesStatic(cityRepository: any) {
  const staticCities = [
    {
      name: 'Oslo',
      region: 'Oslo',
      latitude: 59.9139,
      longitude: 10.7522,
    },
    {
      name: 'Bergen',
      region: 'Vestland',
      latitude: 60.3913,
      longitude: 5.3221,
    },
    {
      name: 'Trondheim',
      region: 'Trøndelag',
      latitude: 63.4305,
      longitude: 10.3951,
    },
    {
      name: 'Stavanger',
      region: 'Rogaland',
      latitude: 58.9699,
      longitude: 5.7331,
    },
    {
      name: 'Kristiansand',
      region: 'Agder',
      latitude: 58.1467,
      longitude: 7.9956,
    }
  ];

  for (const cityData of staticCities) {
    const existingCity = await cityRepository.findOne({
      where: { name: cityData.name }
    });

    if (!existingCity) {
      const city = cityRepository.create({
        name: cityData.name,
        region: cityData.region,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
      });

      await cityRepository.save(city);
      console.log(`Seeded city (static): ${cityData.name}`);
    }
  }
}

