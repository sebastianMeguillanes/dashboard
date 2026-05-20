# Stage 1: Build Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y lock para instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código y hacer build de producción
COPY . .
RUN npm run build

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos estáticos generados por Vite
# Por defecto Vite genera la carpeta /dist
COPY --from=build /app/dist /usr/share/nginx/html

# Eliminar el favicon.svg que no se necesita (solo usar favicon.ico)
RUN rm -f /usr/share/nginx/html/favicon.svg

# Exponer puerto 80 (mapeo externo se hace al correr el contenedor)
EXPOSE 80

# Arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]
