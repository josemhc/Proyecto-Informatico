# Imagen base para Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias y archivos del frontend
COPY ./package*.json ./
RUN npm install
COPY . .

# Generar la build de producción
RUN npm run build

# Exponer el puerto del frontend
EXPOSE 3000

# Ejecutar en modo producción
CMD ["npm", "run", "start"]