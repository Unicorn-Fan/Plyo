import { Lead } from '../entities/lead.entity';
import { LeadId } from '../value-objects/lead-id.vo';
import { Location } from '../value-objects/location.vo';

export interface LeadRepositoryInterface {
  save(lead: Lead): Promise<void>;
  findById(id: LeadId): Promise<Lead | null>;
  findByLocation(location: Location): Promise<Lead[]>;
  findAll(): Promise<Lead[]>;
  update(lead: Lead): Promise<void>;
  delete(id: LeadId): Promise<void>;
}

