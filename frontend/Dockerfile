# Use the official Node.js image as the base image
FROM node:20-alpine 

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Set the command to run the application
CMD ["serve", "-s", "build", "-l", "80"]

# Expose port 80 to the outside world
EXPOSE 80
