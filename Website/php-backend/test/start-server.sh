#!/bin/bash
# Start PHP Development Server
# Usage: ./start-server.sh

echo "Starting PHP development server..."
echo "Server will be available at: http://localhost:8000"
echo ""
echo "Test endpoints:"
echo "  - http://localhost:8000/api/documents"
echo "  - http://localhost:8000/api/hero-images"
echo "  - http://localhost:8000/api/gallery"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start PHP built-in server from parent directory
cd "$(dirname "$0")/.."
php -S localhost:8000