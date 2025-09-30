import { Controller, Post, Get, Put, Param, Body, Query, ValidationPipe, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateLeadCommand } from '@/application/commands/create-lead/create-lead.command';
import { AssignLeadCommand } from '@/application/commands/assign-lead/assign-lead.command';
import { GetLeadQuery } from '@/application/queries/get-lead/get-lead.query';
import { CreateLeadDto } from '@/application/dtos/create-lead.dto';
import { AssignLeadDto } from '@/application/dtos/assign-lead.dto';
import { 
  ApiResponseDto, 
  LeadResponseDto, 
  CreateLeadResponseDto 
} from '@/application/dtos/response-dtos';

@ApiTags('leads')
@Controller('api/leads')
export class LeadsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new lead',
    description: 'Creates a new lead for property services in the Norwegian market'
  })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Lead created successfully',
    type: CreateLeadResponseDto,
    example: {
      success: true,
      message: 'Lead created successfully',
      leadId: '123e4567-e89b-12d3-a456-426614174000'
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        error: 'Full name must be at least 2 characters long'
      }
    }
  })
  async createLead(@Body(ValidationPipe) createLeadDto: CreateLeadDto) {
    const command = new CreateLeadCommand(
      createLeadDto.fullName,
      createLeadDto.phoneNumber,
      createLeadDto.emailAddress,
      createLeadDto.city,
      createLeadDto.comment,
    );

    const leadId = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Lead created successfully',
      leadId,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a lead by ID',
    description: 'Retrieves a specific lead by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Lead ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lead retrieved successfully',
    type: ApiResponseDto<LeadResponseDto>,
    example: {
      success: true,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fullName: 'John Doe',
        phoneNumber: '+47 123 45 678',
        emailAddress: 'john.doe@example.com',
        city: 'Oslo',
        comment: 'Looking for a 3-bedroom apartment',
        status: 'pending',
        assignedBrokerId: null,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Lead not found',
    schema: {
      example: {
        success: false,
        message: 'Lead not found'
      }
    }
  })
  async getLead(@Param('id') id: string) {
    const query = new GetLeadQuery(id);
    const lead = await this.queryBus.execute(query);

    if (!lead) {
      return {
        success: false,
        message: 'Lead not found',
      };
    }

    return {
      success: true,
      data: lead,
    };
  }

  @Put(':id/assign')
  @ApiOperation({ 
    summary: 'Assign a lead to a broker office',
    description: 'Assigns an existing lead to a specific broker office for handling'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Lead ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: AssignLeadDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lead assigned successfully',
    type: ApiResponseDto,
    example: {
      success: true,
      message: 'Lead assigned to broker successfully'
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        error: 'Lead ID must be a valid UUID'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Lead or broker office not found',
    schema: {
      example: {
        success: false,
        message: 'Lead not found'
      }
    }
  })
  async assignLead(
    @Param('id') leadId: string,
    @Body(ValidationPipe) assignLeadDto: AssignLeadDto,
  ) {
    const command = new AssignLeadCommand(leadId, assignLeadDto.brokerOfficeId);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'Lead assigned to broker successfully',
    };
  }
}

