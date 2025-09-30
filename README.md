# Plyo Lead Capture System

A full-stack lead capture system for Norwegian property buyers, built with React, NestJS, and PostgreSQL following DDD and CQRS principles.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (for local development)

### Docker Setup (Recommended)

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd plyo
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Seed Database**
   ```bash
   docker-compose exec backend npm run seed
   ```

4. **Access Applications**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs
   - DB Diagram: https://dbdiagram.io/d/Plyo-DB-Diagram-68dbe595d2b621e4229cb1c0

### Local Development

1. **Setup Environment**
   ```bash
   # Copy environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   ```

2. **Install Dependencies**
   ```bash
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

3. **Start Database**
   ```bash
   docker-compose up postgres -d
   ```

4. **Run Migrations and Seeds**
   ```bash
   cd backend
   npm run migration:run
   npm run seed
   ```

5. **Start Services**
   ```bash
   # Backend
   cd backend && npm run start:dev
   
   # Frontend
   cd frontend && npm start
   ```

## Project Structure

```
plyo/
├── backend/                  # NestJS Backend (DDD + CQRS)
│   ├── src/
│   │   ├── domain/          # Domain entities, value objects, services
│   │   ├── application/     # Commands, queries, DTOs
│   │   ├── infrastructure/  # Database, repositories, external services
│   │   └── presentation/    # Controllers, API endpoints
│   └── Dockerfile
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature modules (lead-capture, broker-listing)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript definitions
│   └── Dockerfile
├── database/                # Database initialization
└── docker-compose.yml       # Development environment
```

## API Endpoints

### Lead Management
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get lead details
- `PUT /api/leads/:id/assign` - Assign lead to broker

### Broker Management
- `GET /api/brokers` - List broker offices
- `GET /api/brokers?city=:city` - Filter by city
- `GET /api/brokers/proximity?city=:city` - Get nearby offices

### Geographic Data
- `GET /api/cities` - List all cities
- `GET /api/cities/search?q=:query` - Search cities

## Core Features

- Lead capture form with Norwegian phone validation
- City autocomplete with Norwegian cities
- Broker office listing and proximity-based matching
- Location-based broker assignment
- DDD architecture with CQRS pattern
- Docker containerization
- PostgreSQL database with proper schema

## Architecture

### Domain-Driven Design (DDD)
- **Domain Layer**: Entities (`Lead`, `BrokerOffice`, `City`), Value Objects, Domain Services
- **Application Layer**: Commands, Queries, DTOs (CQRS pattern)
- **Infrastructure Layer**: TypeORM repositories, database entities
- **Presentation Layer**: REST controllers with Swagger documentation

### Frontend Architecture
- **Feature-based**: Organized by business features
- **Custom Hooks**: Business logic encapsulation
- **TypeScript**: Full type safety with backend integration
- **Modern UI**: Mantine components with Tailwind CSS

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=plyo_db
DATABASE_USER=plyo_user
DATABASE_PASSWORD=plyo_password
PORT=3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
```

## Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm test
```

## Development Commands

```bash
# Docker commands
docker-compose up --build          # Start all services
docker-compose down                # Stop all services
docker-compose logs -f             # View logs
docker-compose exec backend npm run seed  # Seed database

# Backend commands
cd backend
npm run start:dev                  # Start development server
npm run migration:run              # Run database migrations
npm run seed                       # Seed database
npm run test                       # Run tests

# Frontend commands
cd frontend
npm start                          # Start development server
npm test                           # Run tests
npm run build                      # Build for production
```

## Database Schema

- `leads` - Lead information and status
- `broker_offices` - Broker office data with locations
- `cities` - Norwegian cities with coordinates

## License

This project is part of Plyo's engineering challenge assessment.