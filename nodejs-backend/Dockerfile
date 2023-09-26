# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose a port (change this if your app uses a different port)
EXPOSE 9000

RUN npx prisma generate

# Copy the entry point script into the container
COPY entrypoint.sh /entrypoint.sh

# Make the entry point script executable
RUN chmod +x /entrypoint.sh

# Specify the entry point for the container
ENTRYPOINT ["/entrypoint.sh"]
