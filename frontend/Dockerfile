# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app/frontend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application for production
# This creates an optimized build in the /app/frontend/build directory
RUN npm run build


# --- Stage 2: Serve the app with Nginx ---
FROM nginx:stable-alpine AS production

# Copy the static build files from the 'builder' stage
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Copy our custom Nginx configuration
# This is crucial for React Router to work correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default Nginx port)
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]