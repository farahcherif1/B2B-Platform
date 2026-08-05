FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

EXPOSE 3000

# Run the seed command before starting the application
CMD ["sh", "-c", "npm run seed && npm run start:prod"]
