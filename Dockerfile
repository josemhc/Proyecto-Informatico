# Imagen base para Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /ECOMED4D

# Copiar el package.json y package-lock.json de ambas carpetas primero (mejora el cacheo)
COPY ./Backend/package*.json ./Backend/
COPY ./frontend/package*.json ./frontend/

# Instalar dependencias del backend
WORKDIR /ECOMED4D/Backend
RUN npm install

# Instalar dependencias del frontend
WORKDIR /ECOMED4D/frontend
RUN npm install

# Volver al directorio raíz y copiar el resto de los archivos
WORKDIR /ECOMED4D
COPY . .

# Exponer los puertos (ajusta según necesites)
EXPOSE 3000 4000

# Comando para correr ambos servicios simultáneamente
CMD ["sh", "-c", "cd Backend && npm start & cd ../frontend && npm run start"]
