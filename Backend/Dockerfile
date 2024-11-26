# Imagen base para Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias y archivos del backend
COPY ./package*.json ./
RUN npm install
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Comando para iniciar el backend
CMD ["npm", "run", "dev"]
