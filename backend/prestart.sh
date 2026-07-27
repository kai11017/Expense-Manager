#!/bin/bash
set -e

# Run database migrations
echo "Running database migrations via Alembic..."
alembic upgrade head
echo "Migrations completed successfully!"

# Start Uvicorn
echo "Starting Uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
