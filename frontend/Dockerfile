# Use an official Node runtime as a parent image
FROM node:20
# Set the working directory to /app
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY build/ .

COPY . .
# Make port 3000 available to the world outside this container
EXPOSE 3000


# Build the app
RUN npm run build

# Command to run the application
# CMD ["npm", "start"]

# Use a lightweight web server as a base image
#FROM arm64v8/nginx 

#WORKDIR /app
# Remove the default nginx static files
#RUN rm -rf /usr/share/nginx/html/*

# Copy the built files into the container

# COPY --from=build /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/
# # Expose the port the app should run on
# EXPOSE 3000

# # Command to start the web server
# CMD ["nginx", "-g", "daemon off;"]





