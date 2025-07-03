#!/bin/bash

echo "========================================"
echo "Starting Admin Dashboard"
echo "========================================"
echo ""
echo "Admin will be available at: http://localhost:3011"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the admin dashboard
npm run dev 