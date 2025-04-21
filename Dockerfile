
# Usando Nginx para servir os arquivos estáticos gerados
FROM nginx:alpine

# Copia apenas a pasta 'www' gerada pelo Ionic para o diretório do Nginx
COPY ./www /usr/share/nginx/html

# Expondo a porta 80 para o Nginx
EXPOSE 80
