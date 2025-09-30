# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/crypto/package.json ./packages/crypto/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/api ./packages/api
COPY packages/crypto ./packages/crypto
COPY packages/shared ./packages/shared

# Build the application
RUN pnpm --filter api build

# Expose port
EXPOSE 3002

# Start the application
CMD ["pnpm", "--filter", "api", "start"]
