# Use an official NodeJS runtime as a base image
FROM node

# Set the working directory to /app
WORKDIR /app

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run npm run dev when the container launches
CMD cd ./src; npm install; cd ../_scripts; npm install; npm run dev
