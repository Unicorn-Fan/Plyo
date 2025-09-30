# Plyo Lead Capture System - Architecture Documentation

## 🎯 System Overview

This document provides a comprehensive overview of the Plyo Lead Capture System architecture, focusing on the implementation of Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns.

## 🏗️ Architecture Principles

### 1. Domain-Driven Design (DDD)

The system follows DDD principles to ensure business logic is at the center of the architecture:

- **Ubiquitous Language**: Business terminology is consistent across code and documentation
- **Bounded Contexts**: Clear separation between Lead Management, Broker Management, and Geographic contexts
- **Aggregates**: Lead is the main aggregate root with business invariants
- **Value Objects**: Immutable objects like `ContactInfo`, `Location`, and `LeadId`

### 2. Command Query Responsibility Segregation (CQRS)

Separation of read and write operations:

- **Commands**: Handle write operations (Create Lead, Assign Lead)
- **Queries**: Handle read operations (Get Leads, Get Broker Offices)
- **Handlers**: Dedicated handlers for each command/query
- **Models**: Separate models for read and write operations

## 📊 Domain Model

### Core Entities

#### Lead (Aggregate Root)
```typescript
class Lead {
  private readonly id: LeadId;
  private readonly contactInfo: ContactInfo;
  private readonly location: Location;
  private readonly comment: Comment;
  private status: LeadStatus;
  private assignedBrokerId?: BrokerOfficeId;
  
  // Business methods
  assignToBroker(brokerId: BrokerOfficeId): void;
  markAsContacted(): void;
  close(): void;
}
```

#### BrokerOffice
```typescript
class BrokerOffice {
  private readonly id: BrokerOfficeId;
  private readonly name: string;
  private readonly address: string;
  private readonly contactInfo: ContactInfo;
  private readonly location: Location;
  private readonly isActive: boolean;
  
  // Business methods
  isInCity(city: string): boolean;
  calculateDistanceFrom(otherLocation: Location): number;
}
```

#### City
```typescript
class City {
  private readonly id: CityId;
  private readonly name: string;
  private readonly postalCode: string;
  private readonly region: string;
  private readonly location: Location;
  
  // Business methods
  calculateDistanceFrom(otherLocation: Location): number;
  matchesSearchQuery(query: string): boolean;
}
```

### Value Objects

#### ContactInfo
```typescript
class ContactInfo {
  constructor(
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly emailAddress: string,
  ) {
    this.validate();
  }
  
  private validate(): void {
    // Validation logic for Norwegian phone numbers and email
  }
}
```

#### Location
```typescript
class Location {
  constructor(
    public readonly city: string,
    public readonly latitude?: number,
    public readonly longitude?: number,
  ) {
    this.validate();
  }
  
  calculateDistance(other: Location): number {
    // Haversine formula implementation
  }
}
```

## 🔄 CQRS Implementation

### Command Side (Write Operations)

#### CreateLeadCommand
```typescript
@CommandHandler(CreateLeadCommand)
export class CreateLeadHandler implements ICommandHandler<CreateLeadCommand> {
  async execute(command: CreateLeadCommand): Promise<string> {
    // 1. Validate city exists
    // 2. Create value objects
    // 3. Create lead entity
    // 4. Save to repository
    // 5. Return lead ID
  }
}
```

#### AssignLeadCommand
```typescript
@CommandHandler(AssignLeadCommand)
export class AssignLeadHandler implements ICommandHandler<AssignLeadCommand> {
  async execute(command: AssignLeadCommand): Promise<void> {
    // 1. Find lead by ID
    // 2. Use domain service to assign broker
    // 3. Update lead status
    // 4. Save changes
  }
}
```

### Query Side (Read Operations)

#### GetBrokerOfficesQuery
```typescript
@QueryHandler(GetBrokerOfficesQuery)
export class GetBrokerOfficesHandler implements IQueryHandler<GetBrokerOfficesQuery> {
  async execute(query: GetBrokerOfficesQuery): Promise<BrokerOfficeResponseDto[]> {
    // 1. Check for local offices
    // 2. If none, find nearest offices
    // 3. Calculate distances
    // 4. Sort by distance
    // 5. Return DTOs
  }
}
```

## 🗄️ Database Design

### Schema Design

#### Leads Table
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  assigned_broker_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Broker Offices Table
```sql
CREATE TABLE broker_offices (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  city VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Cities Table
```sql
CREATE TABLE cities (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  region VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_broker_offices_city ON broker_offices(city);
CREATE INDEX idx_broker_offices_active ON broker_offices(is_active);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_region ON cities(region);
```

## 🌐 API Design

### RESTful Endpoints

#### Lead Management
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead details
- `PUT /api/leads/:id/assign` - Assign lead to broker

#### Broker Management
- `GET /api/brokers` - List broker offices
- `GET /api/brokers?city=:city` - Filter by city
- `GET /api/brokers/proximity?city=:city` - Get nearby offices

#### Geographic Data
- `GET /api/cities` - List all cities
- `GET /api/cities/search?q=:query` - Search cities

### Request/Response Examples

#### Create Lead Request
```json
POST /api/leads
{
  "fullName": "John Doe",
  "phoneNumber": "+47 123 45 678",
  "emailAddress": "john.doe@example.com",
  "city": "Oslo",
  "comment": "Looking for a 3-bedroom apartment in the city center"
}
```

#### Create Lead Response
```json
{
  "success": true,
  "message": "Lead created successfully",
  "leadId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Broker Offices Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Oslo Eiendomsmegler AS",
      "address": "Karl Johans gate 1, 0154 Oslo",
      "phoneNumber": "+47 22 00 00 01",
      "emailAddress": "oslo@eiendomsmegler.no",
      "city": "Oslo",
      "latitude": 59.9139,
      "longitude": 10.7522,
      "distance": 0.5
    }
  ],
  "count": 1,
  "message": "Local broker offices found"
}
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── LeadCaptureForm
│   ├── CityAutocomplete
│   └── Form Validation
└── BrokerList
    └── BrokerCard[]
```

### State Management

#### Custom Hooks
- `useCitySearch`: Manages city search state and API calls
- `useBrokerSearch`: Handles broker office search and filtering
- `useLeadCapture`: Manages lead submission state

#### Form Management
- Mantine's `useForm` for validation and state
- Real-time validation with Norwegian phone number format
- City autocomplete with debounced search

### API Integration

#### Service Layer
```typescript
export const leadApi = {
  create: async (leadData: CreateLeadRequest): Promise<CreateLeadResponse>,
  getById: async (id: string): Promise<ApiResponse<Lead>>,
  assignToBroker: async (leadId: string, brokerOfficeId: string): Promise<ApiResponse<void>>
};
```

#### Error Handling
- Axios interceptors for consistent error handling
- User-friendly error messages
- Loading states and retry mechanisms

## 🔒 Security Considerations

### Input Validation
- Server-side validation with class-validator
- Client-side validation with Mantine forms
- Norwegian phone number format validation
- Email format validation

### Data Protection
- UUIDs for all entity IDs
- Proper SQL parameterization
- Input sanitization
- CORS configuration

## 📈 Performance Optimizations

### Database
- Proper indexing on frequently queried fields
- Efficient geographic distance calculations
- Connection pooling
- Query optimization

### Frontend
- Component memoization where appropriate
- Debounced search inputs
- Efficient re-rendering
- Lazy loading for large datasets

### API
- Response caching headers
- Efficient data transfer objects
- Pagination for large result sets
- Optimized database queries

## 🚀 Deployment Considerations

### Docker Configuration
- Multi-stage builds for optimization
- Health checks for services
- Environment variable configuration
- Volume management for data persistence

### Environment Setup
- Development: Hot reloading and debugging
- Production: Optimized builds and security
- Database migrations and seeding
- Monitoring and logging

## 🔮 Future Enhancements

### Scalability
- Event sourcing for audit trails
- Microservices architecture
- Message queues for async processing
- Caching layer (Redis)

### Features
- Real-time notifications
- Advanced analytics
- Multi-language support
- Mobile application

### Integration
- External property APIs
- CRM system integration
- Email service integration
- Payment processing
