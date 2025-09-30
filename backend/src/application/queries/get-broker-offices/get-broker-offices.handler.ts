import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBrokerOfficesQuery } from './get-broker-offices.query';
import { BrokerOfficeRepositoryInterface } from '@/domain/repositories/broker-office.repository.interface';
import { Location } from '@/domain/value-objects/location.vo';

export interface BrokerOfficeResponseDto {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

@QueryHandler(GetBrokerOfficesQuery)
export class GetBrokerOfficesHandler implements IQueryHandler<GetBrokerOfficesQuery> {
  constructor(
    @Inject('BrokerOfficeRepositoryInterface')
    private readonly brokerOfficeRepository: BrokerOfficeRepositoryInterface,
  ) {}

  async execute(query: GetBrokerOfficesQuery): Promise<BrokerOfficeResponseDto[]> {
    let brokerOffices;

    if (query.city) {
      brokerOffices = await this.brokerOfficeRepository.findActiveOfficesByCity(query.city);
      
      if (brokerOffices.length === 0 && query.latitude && query.longitude) {
        const location = new Location(query.city, query.latitude, query.longitude);
        brokerOffices = await this.brokerOfficeRepository.findNearestOffices(
          location,
          query.limit || 3
        );
      }
    } else {
      brokerOffices = await this.brokerOfficeRepository.findActiveOffices();
    }

    const response = brokerOffices.map(office => {
      const dto: BrokerOfficeResponseDto = {
        id: office.id.value,
        name: office.name,
        address: office.address,
        phoneNumber: office.contactInfo.phoneNumber,
        emailAddress: office.contactInfo.emailAddress,
        city: office.location.city,
        latitude: office.location.latitude,
        longitude: office.location.longitude,
      };

      if (query.latitude && query.longitude) {
        const queryLocation = new Location(query.city || 'Unknown', query.latitude, query.longitude);
        const distance = office.calculateDistanceFrom(queryLocation);
        if (distance !== null) {
          dto.distance = distance;
        }
      }

      return dto;
    });

    return response.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });
  }
}
