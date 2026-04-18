# Build Stage
FROM node:20 AS build
WORKDIR /app

# Copy package.json and install dependencies
# We use npm install instead of npm ci to handle potential lockfile mismatches between environments
COPY frontend/package.json ./
RUN npm install

# Copy all source files
# Copying the entire frontend directory ensures all necessary configs (tailwind, tsconfig, etc.) are present
COPY frontend/ ./

# Run the build
RUN npm run build

# Production Stage
FROM nginx:stable-alpine
# Copy the built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the service to listen on the port defined by the PORT env var (default 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
