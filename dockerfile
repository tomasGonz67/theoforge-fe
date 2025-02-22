# Example Dockerfile snippet
FROM node:18-slim

# Don't set NODE_ENV=production here if you need dev dependencies for build
# ENV NODE_ENV=production  <-- remove or comment this out if it's blocking dev deps

WORKDIR /app
COPY package*.json ./

# Install ALL dependencies (dev + prod)
RUN npm install

# Copy source
COPY . .

# Build (this will need Vite, so dev deps must be installed)
RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8000"]
