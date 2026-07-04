#!/bin/bash

# Default port to 8080 if not provided by Railway
RAILWAY_PORT="${PORT:-8080}"

# 1. Start the Node.js Fhenix Gateway in the background on port 3001
# We pass PORT inline so we don't overwrite the global Railway PORT variable
echo "Starting Node.js Gateway on port 3001..."
cd fhenix_service
PORT=3001 node server.js &
NODE_PID=$!
cd ..

# 2. Wait a moment to ensure it spins up
sleep 2

# 3. Start the FastAPI application in the foreground
echo "Starting FastAPI Backend on port ${RAILWAY_PORT}..."
# We run FastAPI on the port assigned by Railway so it can be exposed externally
uvicorn app.main:app --host 0.0.0.0 --port $RAILWAY_PORT
