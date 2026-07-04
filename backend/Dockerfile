FROM python:3.11-slim

# Install Node.js and dos2unix
RUN apt-get update && apt-get install -y curl dos2unix \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire backend directory
COPY . /app/

# Install Python dependencies (Using CPU-only PyTorch to save massive memory/space)
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
WORKDIR /app/fhenix_service
RUN npm install

# Go back to root
WORKDIR /app

# Fix Windows CRLF line endings to LF, just in case
RUN dos2unix start.sh
RUN chmod +x start.sh

# Expose the default Railway port (or 8000 if not set)
EXPOSE $PORT

# Start both services
CMD ["./start.sh"]
