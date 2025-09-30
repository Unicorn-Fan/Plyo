import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCitiesQuery } from './get-cities.query';
import { CityRepositoryInterface } from '@/domain/repositories/city.repository.interface';

export interface CityResponseDto {
  id: string;
  name: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  constructor(
    @Inject('CityRepositoryInterface')
    private readonly cityRepository: CityRepositoryInterface,
  ) {}

  async execute(query: GetCitiesQuery): Promise<CityResponseDto[]> {
    let cities;

    if (query.searchQuery) {
      cities = await this.cityRepository.searchByName(query.searchQuery);
    } else {
      cities = await this.cityRepository.findAll();
    }

    return cities.map(city => ({
      id: city.id.value,
      name: city.name,
      region: city.region,
      latitude: city.location.latitude,
      longitude: city.location.longitude,
    }));
  }
}
