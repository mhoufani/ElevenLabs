# Use the official Node.js image
FROM node:18.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with platform-specific binaries
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port Vite runs on
EXPOSE 3000

# Command to run the app with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
