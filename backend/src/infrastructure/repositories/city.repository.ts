import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { CityEntity } from '../database/entities/city.entity';
import { City } from '@/domain/entities/city.entity';
import { CityId } from '@/domain/value-objects/city-id.vo';
import { Location } from '@/domain/value-objects/location.vo';
import { CityRepositoryInterface } from '@/domain/repositories/city.repository.interface';

@Injectable()
export class CityRepository implements CityRepositoryInterface {
  constructor(
    @InjectRepository(CityEntity)
    private readonly repository: Repository<CityEntity>,
  ) {}

  async save(city: City): Promise<void> {
    const entity = this.domainToEntity(city);
    await this.repository.save(entity);
  }

  async findById(id: CityId): Promise<City | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByName(name: string): Promise<City | null> {
    const entity = await this.repository.findOne({ 
      where: { name: name } 
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async searchByName(query: string): Promise<City[]> {
    const entities = await this.repository.find({
      where: [
        { name: Raw(alias => `LOWER(${alias}) LIKE LOWER(:query)`, { query: `%${query}%` }) },
        { region: Raw(alias => `LOWER(${alias}) LIKE LOWER(:query)`, { query: `%${query}%` }) }
      ],
      take: 20
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findAll(): Promise<City[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(city: City): Promise<void> {
    const entity = this.domainToEntity(city);
    await this.repository.save(entity);
  }

  async delete(id: CityId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(city: City): CityEntity {
    const entity = new CityEntity();
    entity.id = city.id.value;
    entity.name = city.name;
    entity.region = city.region;
    entity.latitude = city.location.latitude;
    entity.longitude = city.location.longitude;
    entity.createdAt = city.createdAt;
    entity.updatedAt = city.updatedAt;
    return entity;
  }

  private entityToDomain(entity: CityEntity): City {
    const location = new Location(
      entity.name,
      entity.latitude,
      entity.longitude,
    );
    
    return new City(
      new CityId(entity.id),
      entity.name,
      entity.region,
      location,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

