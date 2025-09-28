# Use the latest LTS version of Node.js
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first for better caching
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000


# Define the command to run your app
CMD ["yarn", "start"]