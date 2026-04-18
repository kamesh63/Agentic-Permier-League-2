FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY frontend/package.json ./

# Install dependencies fresh (generates correct native bindings for Linux)
RUN npm install

# Copy source code
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./
COPY frontend/src/ ./src/

# Build
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
