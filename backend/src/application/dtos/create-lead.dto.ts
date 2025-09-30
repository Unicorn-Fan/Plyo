import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ 
    description: 'Full name of the lead',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @ApiProperty({ 
    description: 'Phone number of the lead',
    example: '+47 123 45 678',
    minLength: 8,
    maxLength: 20
  })
  @IsString()
  @MinLength(8, { message: 'Phone number must be at least 8 characters long' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phoneNumber: string;

  @ApiProperty({ 
    description: 'Email address of the lead',
    example: 'john.doe@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  emailAddress: string;

  @ApiProperty({ 
    description: 'City where the lead is located',
    example: 'Oslo',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2, { message: 'City must be at least 2 characters long' })
  @MaxLength(50, { message: 'City must not exceed 50 characters' })
  city: string;

  @ApiProperty({ 
    description: 'Optional comment from the lead',
    example: 'Looking for a 3-bedroom apartment in the city center',
    required: false,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  comment?: string;
}

