import { Injectable, Inject } from '@nestjs/common';
import { Lead } from '../entities/lead.entity';
import { BrokerOffice } from '../entities/broker-office.entity';
import { BrokerOfficeRepositoryInterface } from '../repositories/broker-office.repository.interface';

@Injectable()
export class LeadAssignmentService {
  constructor(
    @Inject('BrokerOfficeRepositoryInterface')
    private readonly brokerOfficeRepository: BrokerOfficeRepositoryInterface,
  ) {}

  public async findSuitableBrokers(lead: Lead): Promise<BrokerOffice[]> {
    const leadCity = lead.location.city;
    
    const localBrokers = await this.brokerOfficeRepository.findActiveOfficesByCity(leadCity);
    
    if (localBrokers.length > 0) {
      return localBrokers;
    }
    
    const nearestBrokers = await this.brokerOfficeRepository.findNearestOffices(
      lead.location,
      3
    );
    
    return nearestBrokers;
  }

  public async assignLeadToBroker(lead: Lead, brokerId: string): Promise<void> {
    const broker = await this.brokerOfficeRepository.findById(
      { value: brokerId } as any
    );
    
    if (!broker) {
      throw new Error('Broker office not found');
    }
    
    if (!broker.isActive) {
      throw new Error('Cannot assign lead to inactive broker office');
    }
    
    lead.assignToBroker(broker.id);
  }
}
