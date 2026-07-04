#!/bin/bash

# Default port to 10000 if not provided by Render
WEB_PORT="${PORT:-10000}"

# 1. Start the Node.js Fhenix Gateway in the background on port 3001
# We pass PORT inline so we don't overwrite the global Render PORT variable
echo "Starting Node.js Gateway on port 3001..."
cd fhenix_service
PORT=3001 node server.js &
NODE_PID=$!
cd ..

# 2. Wait a moment to ensure it spins up
sleep 2

# 3. Start the FastAPI application in the foreground
echo "Starting FastAPI Backend on port ${WEB_PORT}..."
# We run FastAPI on the port assigned by Render so it can be exposed externally
uvicorn app.main:app --host 0.0.0.0 --port $WEB_PORT
