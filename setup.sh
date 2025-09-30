#!/bin/bash

echo "Setting up Plyo Lead Capture System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend environment file..."
    cp backend/env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend environment file..."
    cp frontend/env.example frontend/.env
fi

# Build and start services
echo "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking service status..."
docker-compose ps

# Run database seeds
echo "Seeding database..."
docker-compose exec backend npm run seed

echo ""
echo "Setup completed successfully!"
echo ""
echo "Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:3000"
echo "   API Documentation: http://localhost:3000/api/docs"
echo ""
echo "Database:"
echo "   Host: localhost:5432"
echo "   Database: plyo_db"
echo "   User: plyo_user"
echo "   Password: plyo_password"
echo ""
echo "Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Rebuild: docker-compose up --build"
echo ""
echo "Setup complete!"

