import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetCitiesQuery } from '@/application/queries/get-cities/get-cities.query';
import { CitiesResponseDto } from '@/application/dtos/response-dtos';
import { NorwegianCitiesService } from '@/infrastructure/services/norwegian-cities.service';

@ApiTags('cities')
@Controller('api/cities')
export class CitiesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly norwegianCitiesService: NorwegianCitiesService
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all cities',
    description: 'Retrieves all available Norwegian cities'
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Optional search term to filter cities',
    example: 'Oslo'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Cities retrieved successfully',
    type: CitiesResponseDto,
    example: {
      success: true,
      data: [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Oslo',
          region: 'Oslo',
          latitude: 59.9139,
          longitude: 10.7522
        }
      ],
      count: 1
    }
  })
  async getCities(@Query('search') search?: string) {
    const query = new GetCitiesQuery(search);
    const cities = await this.queryBus.execute(query);

    return {
      success: true,
      data: cities,
      count: cities.length,
    };
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search cities',
    description: 'Searches for cities by name with a minimum query length of 2 characters'
  })
  @ApiQuery({ 
    name: 'q', 
    required: true, 
    description: 'Search query (minimum 2 characters)',
    example: 'Oslo'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Cities found successfully',
    type: CitiesResponseDto,
    example: {
      success: true,
      data: [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Oslo',
          region: 'Oslo',
          latitude: 59.9139,
          longitude: 10.7522
        }
      ],
      count: 1
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Search query too short',
    schema: {
      example: {
        success: false,
        message: 'Search query must be at least 2 characters long',
        data: [],
        count: 0
      }
    }
  })
  async searchCities(@Query('q') searchQuery: string) {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return {
        success: false,
        message: 'Search query must be at least 2 characters long',
        data: [],
        count: 0,
      };
    }

    const query = new GetCitiesQuery(searchQuery.trim());
    const cities = await this.queryBus.execute(query);

    return {
      success: true,
      data: cities,
      count: cities.length,
    };
  }

  @Get('norwegian')
  @ApiOperation({ 
    summary: 'Get Norwegian cities from API',
    description: 'Retrieves Norwegian cities directly from the external API. This endpoint bypasses the database and returns real-time data from the Norwegian cities service.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Successfully retrieved Norwegian cities from API',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Oslo' },
          region: { type: 'string', example: 'Oslo' },
          latitude: { type: 'number', example: 59.9139 },
          longitude: { type: 'number', example: 10.7522 }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error or API unavailable',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Failed to fetch Norwegian cities from API' },
        data: { type: 'array', example: [] },
        count: { type: 'number', example: 0 }
      }
    }
  })
  async getNorwegianCities() {
    try {
      const cities = await this.norwegianCitiesService.getNorwegianCities();
      return {
        success: true,
        data: cities,
        count: cities.length,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch Norwegian cities from API',
        data: [],
        count: 0,
      };
    }
  }
}
