# Imagen base para Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias y archivos del frontend
COPY ./package*.json ./
RUN npm install
COPY . .

# Exponer el puerto del frontend
EXPOSE 3000

# Comando para iniciar el frontend
CMD ["npm", "run", "dev"]
