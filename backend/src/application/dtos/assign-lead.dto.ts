import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLeadDto {
  @ApiProperty({ 
    description: 'ID of the lead to assign',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'Lead ID must be a valid UUID' })
  leadId: string;

  @ApiProperty({ 
    description: 'ID of the broker office to assign the lead to',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID(4, { message: 'Broker Office ID must be a valid UUID' })
  brokerOfficeId: string;
}

