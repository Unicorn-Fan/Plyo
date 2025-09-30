import { City } from '../entities/city.entity';
import { CityId } from '../value-objects/city-id.vo';

export interface CityRepositoryInterface {
  save(city: City): Promise<void>;
  findById(id: CityId): Promise<City | null>;
  findByName(name: string): Promise<City | null>;
  searchByName(query: string): Promise<City[]>;
  findAll(): Promise<City[]>;
  update(city: City): Promise<void>;
  delete(id: CityId): Promise<void>;
}

