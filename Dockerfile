# Imagen base para Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /ECOMED4D

# Copiar dependencias del backend
COPY ./Backend/package*.json ./Backend/
WORKDIR /ECOMED4D/Backend
RUN npm install

# Copiar dependencias del frontend
WORKDIR /ECOMED4D
COPY ./frontend/package*.json ./frontend/
WORKDIR /ECOMED4D/frontend
RUN npm install

# Copiar el resto de los archivos al contenedor
WORKDIR /ECOMED4D
COPY . .
RUN npm install

# Exponer los puertos
EXPOSE 3000 5000

# Comando para iniciar ambos servicios
WORKDIR /ECOMED4D
CMD ["sh", "-c", "cd Backend && npm run dev & cd frontend && npm run dev"]
