import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadEntity } from '../database/entities/lead.entity';
import { Lead } from '@/domain/entities/lead.entity';
import { LeadId } from '@/domain/value-objects/lead-id.vo';
import { ContactInfo } from '@/domain/value-objects/contact-info.vo';
import { Location } from '@/domain/value-objects/location.vo';
import { Comment } from '@/domain/value-objects/comment.vo';
import { BrokerOfficeId } from '@/domain/value-objects/broker-office-id.vo';
import { LeadStatus } from '@/domain/enums/lead-status.enum';
import { LeadRepositoryInterface } from '@/domain/repositories/lead.repository.interface';

@Injectable()
export class LeadRepository implements LeadRepositoryInterface {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly repository: Repository<LeadEntity>,
  ) {}

  async save(lead: Lead): Promise<void> {
    const entity = this.domainToEntity(lead);
    await this.repository.save(entity);
  }

  async findById(id: LeadId): Promise<Lead | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByLocation(location: Location): Promise<Lead[]> {
    const entities = await this.repository.find({
      where: { city: location.city }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findAll(): Promise<Lead[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(lead: Lead): Promise<void> {
    const entity = this.domainToEntity(lead);
    await this.repository.save(entity);
  }

  async delete(id: LeadId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(lead: Lead): LeadEntity {
    const entity = new LeadEntity();
    entity.id = lead.id.value;
    entity.fullName = lead.contactInfo.fullName;
    entity.phoneNumber = lead.contactInfo.phoneNumber;
    entity.emailAddress = lead.contactInfo.emailAddress;
    entity.city = lead.location.city;
    entity.latitude = lead.location.latitude;
    entity.longitude = lead.location.longitude;
    entity.comment = lead.comment.isEmpty() ? null : lead.comment.value;
    entity.status = lead.status;
    entity.assignedBrokerId = lead.assignedBrokerId?.value;
    entity.createdAt = lead.createdAt;
    entity.updatedAt = lead.updatedAt;
    return entity;
  }

  private entityToDomain(entity: LeadEntity): Lead {
    const contactInfo = new ContactInfo(
      entity.fullName,
      entity.phoneNumber,
      entity.emailAddress,
    );
    
    const location = new Location(
      entity.city,
      entity.latitude,
      entity.longitude,
    );
    
    const comment = new Comment(entity.comment || '');
    
    const lead = new Lead(
      new LeadId(entity.id),
      contactInfo,
      location,
      comment,
      entity.status as LeadStatus,
      entity.assignedBrokerId ? new BrokerOfficeId(entity.assignedBrokerId) : undefined,
      entity.createdAt,
      entity.updatedAt,
    );

    return lead;
  }
}

