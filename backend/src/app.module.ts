import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { AppDataSource } from '@/infrastructure/database/data-source';
import { LeadEntity } from '@/infrastructure/database/entities/lead.entity';
import { BrokerOfficeEntity } from '@/infrastructure/database/entities/broker-office.entity';
import { CityEntity } from '@/infrastructure/database/entities/city.entity';

import { LeadRepository } from '@/infrastructure/repositories/lead.repository';
import { BrokerOfficeRepository } from '@/infrastructure/repositories/broker-office.repository';
import { CityRepository } from '@/infrastructure/repositories/city.repository';

import { LeadAssignmentService } from '@/domain/services/lead-assignment.service';

import { NorwegianCitiesService } from '@/infrastructure/services/norwegian-cities.service';

import { CreateLeadHandler } from '@/application/commands/create-lead/create-lead.handler';
import { AssignLeadHandler } from '@/application/commands/assign-lead/assign-lead.handler';

import { GetLeadHandler } from '@/application/queries/get-lead/get-lead.handler';
import { GetCitiesHandler } from '@/application/queries/get-cities/get-cities.handler';
import { GetBrokerOfficesHandler } from '@/application/queries/get-broker-offices/get-broker-offices.handler';

import { LeadsController } from '@/presentation/controllers/leads.controller';
import { BrokerOfficesController } from '@/presentation/controllers/broker-offices.controller';
import { CitiesController } from '@/presentation/controllers/cities.controller';

const CommandHandlers = [CreateLeadHandler, AssignLeadHandler];
const QueryHandlers = [GetLeadHandler, GetCitiesHandler, GetBrokerOfficesHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'plyo_user',
      password: process.env.DATABASE_PASSWORD || 'plyo_password',
      database: process.env.DATABASE_NAME || 'plyo_db',
      entities: [LeadEntity, BrokerOfficeEntity, CityEntity],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([LeadEntity, BrokerOfficeEntity, CityEntity]),
    CqrsModule,
  ],
  controllers: [LeadsController, BrokerOfficesController, CitiesController],
  providers: [
    {
      provide: 'LeadRepositoryInterface',
      useClass: LeadRepository,
    },
    {
      provide: 'BrokerOfficeRepositoryInterface',
      useClass: BrokerOfficeRepository,
    },
    {
      provide: 'CityRepositoryInterface',
      useClass: CityRepository,
    },
    LeadAssignmentService,
    NorwegianCitiesService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class AppModule {}
