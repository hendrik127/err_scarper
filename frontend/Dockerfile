# Use an official Node runtime as a parent image
FROM node:20-bullseye-slim as build
WORKDIR '/app'

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Use NGINX to serve the built files
FROM nginx

COPY /etc/letsencrypt/live/rahvushaaling.ee/fullchain.pem /etc/nginx/ssl/fullchain.pem

COPY /etc/letsencrypt/live/rahvushaaling.ee/privkey.pem /etc/nginx/ssl/privkey.pem
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 3000

# RUN apk add --update nodejs npm
#CMD ["nginx", "-g", "daemon off;"]
