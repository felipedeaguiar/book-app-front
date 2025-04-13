# Etapa 1: Build da aplicação Ionic
FROM node:16-alpine AS build

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o código da aplicação Ionic
COPY . .

# Gerar build para produção
RUN npm run build --prod

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copiar os arquivos gerados para o Nginx
COPY --from=build /app/www /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80
