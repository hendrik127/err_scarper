# Use an official Node runtime as a parent image
FROM node:20-bullseye-slim
# Set the working directory to /app
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# Install app dependencies
# RUN npm install

# Copy the current directory contents into the container at /app
COPY build/ .

# Make port 3000 available to the world outside this container
EXPOSE 3000


# Build the app
# RUN npm run build

# Command to run the application
CMD ["npm", "start"]







