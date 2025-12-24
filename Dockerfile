# Use Node.js LTS version
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Start the application
CMD ["npm", "start"]
