# Use Node 18 Alpine as base image
FROM node:18-alpine

# Install ffmpeg (with all necessary dependencies)
RUN apk update && apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm/yarn lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application files
COPY . .

# Expose port (optional, if your app runs on a specific port like 3000)
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
