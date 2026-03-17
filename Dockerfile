# DePaul Athletics ITAM - Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create data directory for persistent storage
RUN mkdir -p /app/data

# Expose ports
# 3000 - HTTP server
# 3443 - HTTPS server (for mobile camera access)
EXPOSE 3000 3443

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
