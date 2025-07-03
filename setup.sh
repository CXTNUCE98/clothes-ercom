#!/bin/bash

echo "========================================"
echo "Clothes E-commerce Project Setup"
echo "========================================"

echo ""
echo "Setting up Backend..."
cd backend
echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

echo "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
fi

echo "Initializing database..."
npm run init-db
if [ $? -ne 0 ]; then
    echo "Error initializing database"
    exit 1
fi

echo "Backend setup completed!"
echo ""
echo "Setting up Frontend..."
cd ../frontend
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi

echo "Frontend setup completed!"
echo ""
echo "Setting up Admin..."
cd ../admin
echo "Installing admin dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing admin dependencies"
    exit 1
fi

echo "Admin setup completed!"
echo ""
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "To run the project:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Start admin: cd admin && npm run dev"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:3000"
echo "Admin will run on: http://localhost:3011"
echo "" 