# Usando Nginx para servir os arquivos estáticos gerados
FROM nginx:alpine

# Copia apenas a pasta 'www' gerada pelo Ionic para o diretório do Nginx
COPY ./www /usr/share/nginx/html

COPY ./docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Expondo a porta 80 para o Nginx
EXPOSE 80
