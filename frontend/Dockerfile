# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Install necessary packages for building
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the application in development mode
CMD ["npm", "run", "dev"]
