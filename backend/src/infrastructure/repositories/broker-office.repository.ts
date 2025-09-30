import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerOfficeEntity } from '../database/entities/broker-office.entity';
import { BrokerOffice } from '@/domain/entities/broker-office.entity';
import { BrokerOfficeId } from '@/domain/value-objects/broker-office-id.vo';
import { ContactInfo } from '@/domain/value-objects/contact-info.vo';
import { Location } from '@/domain/value-objects/location.vo';
import { BrokerOfficeRepositoryInterface } from '@/domain/repositories/broker-office.repository.interface';

@Injectable()
export class BrokerOfficeRepository implements BrokerOfficeRepositoryInterface {
  constructor(
    @InjectRepository(BrokerOfficeEntity)
    private readonly repository: Repository<BrokerOfficeEntity>,
  ) {}

  async save(brokerOffice: BrokerOffice): Promise<void> {
    const entity = this.domainToEntity(brokerOffice);
    await this.repository.save(entity);
  }

  async findById(id: BrokerOfficeId): Promise<BrokerOffice | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByCity(city: string): Promise<BrokerOffice[]> {
    const entities = await this.repository.find({
      where: { city: city }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findActiveOffices(): Promise<BrokerOffice[]> {
    const entities = await this.repository.find({
      where: { isActive: true }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findActiveOfficesByCity(city: string): Promise<BrokerOffice[]> {
    const entities = await this.repository.find({
      where: { 
        city: city,
        isActive: true 
      }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findNearestOffices(location: Location, limit: number = 3): Promise<BrokerOffice[]> {
    if (!location.latitude || !location.longitude) {
      return this.findActiveOffices().then(offices => offices.slice(0, limit));
    }

    const entities = await this.repository
      .createQueryBuilder('broker_office')
      .select('*')
      .addSelect(
        `6371 * acos(cos(radians(${location.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${location.longitude})) + sin(radians(${location.latitude})) * sin(radians(latitude)))`,
        'distance'
      )
      .where('is_active = :isActive', { isActive: true })
      .andWhere('latitude IS NOT NULL')
      .andWhere('longitude IS NOT NULL')
      .orderBy('distance', 'ASC')
      .limit(limit)
      .getRawMany();

    return entities.map(entity => this.rawToDomain(entity));
  }

  async findAll(): Promise<BrokerOffice[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(brokerOffice: BrokerOffice): Promise<void> {
    const entity = this.domainToEntity(brokerOffice);
    await this.repository.save(entity);
  }

  async delete(id: BrokerOfficeId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(brokerOffice: BrokerOffice): BrokerOfficeEntity {
    const entity = new BrokerOfficeEntity();
    entity.id = brokerOffice.id.value;
    entity.name = brokerOffice.name;
    entity.address = brokerOffice.address;
    entity.phoneNumber = brokerOffice.contactInfo.phoneNumber;
    entity.emailAddress = brokerOffice.contactInfo.emailAddress;
    entity.city = brokerOffice.location.city;
    entity.latitude = brokerOffice.location.latitude;
    entity.longitude = brokerOffice.location.longitude;
    entity.isActive = brokerOffice.isActive;
    entity.createdAt = brokerOffice.createdAt;
    entity.updatedAt = brokerOffice.updatedAt;
    return entity;
  }

  private entityToDomain(entity: BrokerOfficeEntity): BrokerOffice {
    const contactInfo = new ContactInfo(
      entity.name,
      entity.phoneNumber,
      entity.emailAddress,
    );
    
    const location = new Location(
      entity.city,
      entity.latitude,
      entity.longitude,
    );
    
    return new BrokerOffice(
      new BrokerOfficeId(entity.id),
      entity.name,
      entity.address,
      contactInfo,
      location,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private rawToDomain(raw: any): BrokerOffice {
    const contactInfo = new ContactInfo(
      raw.name,
      raw.phone_number,
      raw.email_address,
    );
    
    const location = new Location(
      raw.city,
      raw.latitude,
      raw.longitude,
    );
    
    return new BrokerOffice(
      new BrokerOfficeId(raw.id),
      raw.name,
      raw.address,
      contactInfo,
      location,
      raw.is_active,
      raw.created_at,
      raw.updated_at,
    );
  }
}

