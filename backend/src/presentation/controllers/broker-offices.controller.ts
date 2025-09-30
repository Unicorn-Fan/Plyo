import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetBrokerOfficesQuery } from '@/application/queries/get-broker-offices/get-broker-offices.query';
import { BrokerOfficesResponseDto } from '@/application/dtos/response-dtos';

@ApiTags('brokers')
@Controller('api/brokers')
export class BrokerOfficesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get broker offices',
    description: 'Retrieves broker offices, optionally filtered by city or proximity to coordinates'
  })
  @ApiQuery({ 
    name: 'city', 
    required: false, 
    description: 'Filter by city name',
    example: 'Oslo'
  })
  @ApiQuery({ 
    name: 'latitude', 
    required: false, 
    description: 'Latitude for proximity search',
    example: 59.9139
  })
  @ApiQuery({ 
    name: 'longitude', 
    required: false, 
    description: 'Longitude for proximity search',
    example: 10.7522
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of results',
    example: 10
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Broker offices retrieved successfully',
    type: BrokerOfficesResponseDto,
    example: {
      success: true,
      data: [
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
      ],
      count: 1
    }
  })
  async getBrokerOffices(
    @Query('city') city?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('limit') limit?: string,
  ) {
    const query = new GetBrokerOfficesQuery(
      city,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
      limit ? parseInt(limit) : undefined,
    );

    const brokerOffices = await this.queryBus.execute(query);

    return {
      success: true,
      data: brokerOffices,
      count: brokerOffices.length,
    };
  }

  @Get('proximity')
  @ApiOperation({ 
    summary: 'Get broker offices by proximity',
    description: 'Finds the nearest broker offices to given coordinates, with a default limit of 3'
  })
  @ApiQuery({ 
    name: 'city', 
    required: false, 
    description: 'City name for context',
    example: 'Oslo'
  })
  @ApiQuery({ 
    name: 'latitude', 
    required: true, 
    description: 'Latitude for proximity search',
    example: 59.9139
  })
  @ApiQuery({ 
    name: 'longitude', 
    required: true, 
    description: 'Longitude for proximity search',
    example: 10.7522
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of results (default: 3)',
    example: 3
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Nearest broker offices retrieved successfully',
    type: BrokerOfficesResponseDto,
    example: {
      success: true,
      data: [
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
      ],
      count: 1,
      message: 'Showing nearest broker offices'
    }
  })
  async getProximityBrokerOffices(
    @Query('city') city?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('limit') limit?: string,
  ) {
    const query = new GetBrokerOfficesQuery(
      city,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
      limit ? parseInt(limit) : 3,
    );

    const brokerOffices = await this.queryBus.execute(query);

    return {
      success: true,
      data: brokerOffices,
      count: brokerOffices.length,
      message: brokerOffices.length > 0 
        ? brokerOffices[0].city === city 
          ? 'Local broker offices found' 
          : 'Showing nearest broker offices'
        : 'No broker offices found',
    };
  }
}

