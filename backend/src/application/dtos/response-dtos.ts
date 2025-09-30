import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response message', example: 'Operation completed successfully' })
  message?: string;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T;

  @ApiProperty({ description: 'Count of items returned', example: 10, required: false })
  count?: number;
}

export class LeadResponseDto {
  @ApiProperty({ description: 'Unique identifier for the lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Full name of the lead', example: 'John Doe' })
  fullName: string;

  @ApiProperty({ description: 'Phone number of the lead', example: '+47 123 45 678' })
  phoneNumber: string;

  @ApiProperty({ description: 'Email address of the lead', example: 'john.doe@example.com' })
  emailAddress: string;

  @ApiProperty({ description: 'City where the lead is located', example: 'Oslo' })
  city: string;

  @ApiProperty({ description: 'Optional comment from the lead', example: 'Looking for a 3-bedroom apartment', required: false })
  comment?: string;

  @ApiProperty({ description: 'Current status of the lead', example: 'pending', enum: ['pending', 'assigned', 'contacted', 'closed'] })
  status: string;

  @ApiProperty({ description: 'ID of the assigned broker office', example: '123e4567-e89b-12d3-a456-426614174001', required: false })
  assignedBrokerId?: string;

  @ApiProperty({ description: 'Date when the lead was created', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the lead was last updated', example: '2024-01-15T14:45:00Z' })
  updatedAt: Date;
}

export class BrokerOfficeResponseDto {
  @ApiProperty({ description: 'Unique identifier for the broker office', example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ description: 'Name of the broker office', example: 'Oslo Property Solutions' })
  name: string;

  @ApiProperty({ description: 'Address of the broker office', example: 'Karl Johans gate 1, 0154 Oslo' })
  address: string;

  @ApiProperty({ description: 'Phone number of the broker office', example: '+47 22 12 34 56' })
  phoneNumber: string;

  @ApiProperty({ description: 'Email address of the broker office', example: 'info@osloproperty.no' })
  emailAddress: string;

  @ApiProperty({ description: 'City where the broker office is located', example: 'Oslo' })
  city: string;

  @ApiProperty({ description: 'Latitude coordinate of the broker office', example: 59.9139, required: false })
  latitude?: number;

  @ApiProperty({ description: 'Longitude coordinate of the broker office', example: 10.7522, required: false })
  longitude?: number;

  @ApiProperty({ description: 'Distance from search location in kilometers', example: 2.5, required: false })
  distance?: number;
}

export class CityResponseDto {
  @ApiProperty({ description: 'Unique identifier for the city', example: '123e4567-e89b-12d3-a456-426614174002' })
  id: string;

  @ApiProperty({ description: 'Name of the city', example: 'Oslo' })
  name: string;

  @ApiProperty({ description: 'Region where the city is located', example: 'Oslo' })
  region: string;

  @ApiProperty({ description: 'Latitude coordinate of the city', example: 59.9139, required: false })
  latitude?: number;

  @ApiProperty({ description: 'Longitude coordinate of the city', example: 10.7522, required: false })
  longitude?: number;
}

export class CreateLeadResponseDto extends ApiResponseDto<{ leadId: string }> {
  @ApiProperty({ description: 'ID of the created lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  leadId: string;
}

export class BrokerOfficesResponseDto extends ApiResponseDto<BrokerOfficeResponseDto[]> {
  @ApiProperty({ 
    type: [BrokerOfficeResponseDto], 
    description: 'List of broker offices',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Oslo Property Solutions',
        address: 'Karl Johans gate 1, 0154 Oslo',
        phoneNumber: '+47 22 12 34 56',
        emailAddress: 'info@osloproperty.no',
        city: 'Oslo',
        latitude: 59.9139,
        longitude: 10.7522,
        distance: 2.5
      }
    ]
  })
  data: BrokerOfficeResponseDto[];
}

export class CitiesResponseDto extends ApiResponseDto<CityResponseDto[]> {
  @ApiProperty({ 
    type: [CityResponseDto], 
    description: 'List of cities',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Oslo',
        region: 'Oslo',
        latitude: 59.9139,
        longitude: 10.7522
      }
    ]
  })
  data: CityResponseDto[];
}
