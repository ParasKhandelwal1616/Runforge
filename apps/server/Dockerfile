FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy all packages and apps
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Install all dependencies
RUN npm install

# Build the server
RUN cd apps/server && npm run build

# Start the server
CMD ["node", "apps/server/dist/index.js"]