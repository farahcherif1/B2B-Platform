FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . . 

RUN npm run build

FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
