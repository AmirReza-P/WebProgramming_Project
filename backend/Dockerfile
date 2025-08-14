# Stage 1: Use an official Node.js runtime as a parent image
# Using 'alpine' for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json first to leverage Docker layer caching
# This ensures that 'npm install' is only re-run when dependencies change
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application's source code from your local machine to the container
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define the command to run your app
CMD ["node", "server.js"]