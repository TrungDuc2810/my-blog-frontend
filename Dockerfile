# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY my-blog/package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY my-blog/ .

# Create .env file from environment variables
RUN echo "VITE_API_URL=${API_URL:-http://localhost:8080}" > .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Configure nginx with proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]