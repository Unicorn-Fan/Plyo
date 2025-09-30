import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { LeadEntity } from './entities/lead.entity';
import { BrokerOfficeEntity } from './entities/broker-office.entity';
import { CityEntity } from './entities/city.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'plyo_user',
  password: process.env.DATABASE_PASSWORD || 'plyo_password',
  database: process.env.DATABASE_NAME || 'plyo_db',
  entities: [LeadEntity, BrokerOfficeEntity, CityEntity],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});

