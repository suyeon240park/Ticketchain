# Use Node.js as base image
FROM node:18 AS builder

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install all dependencies (including Hardhat, OpenZeppelin, etc.)
RUN npm install

# Copy the entire project into the container
COPY . .

# Compile smart contracts (from the correct directory)
WORKDIR /app/ticket-contracts

# Return to root directory to build Next.js app
WORKDIR /app
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]