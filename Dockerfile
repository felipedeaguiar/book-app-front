
# Etapa 1 - Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2 - Servir os assets
FROM nginx:alpine
COPY --from=build /app/www /usr/share/nginx/html
COPY ./docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80