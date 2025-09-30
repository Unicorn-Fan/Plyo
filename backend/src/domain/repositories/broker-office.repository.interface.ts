import { BrokerOffice } from '../entities/broker-office.entity';
import { BrokerOfficeId } from '../value-objects/broker-office-id.vo';
import { Location } from '../value-objects/location.vo';

export interface BrokerOfficeRepositoryInterface {
  save(brokerOffice: BrokerOffice): Promise<void>;
  findById(id: BrokerOfficeId): Promise<BrokerOffice | null>;
  findByCity(city: string): Promise<BrokerOffice[]>;
  findActiveOffices(): Promise<BrokerOffice[]>;
  findActiveOfficesByCity(city: string): Promise<BrokerOffice[]>;
  findNearestOffices(location: Location, limit?: number): Promise<BrokerOffice[]>;
  findAll(): Promise<BrokerOffice[]>;
  update(brokerOffice: BrokerOffice): Promise<void>;
  delete(id: BrokerOfficeId): Promise<void>;
}

