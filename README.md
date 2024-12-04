# Proyecto ECOMED4D desplegado en:

# [Despliegue en vivo](https://ecomed-frontend-1-0.onrender.com)



## Funcionamiento de la aplicacion:

La aplicacion esta hecha para medicos y pacientes de una empresa de que se dedica a la gestion de diagnosticos y ecografias de embarazos

### Medicos

Los medicos se pueden registrar cambiando el rol a medico en el formulario de inicio, y presionando el boton registrarse, una vez hayan iniciado sesion,  tienen opciones como convertir videos AVI a mp4, crear los usuarios de sus pacientes y enviar archivos a los pacientes que ha creado

### Pacientes

Los pacientes NO pueden ni necesitan registrarse, un paciente UNICAMENTE puede iniciar sesion si su medico ya ha creado su usuario en el sistema y le ha proporcionado su respectiva contraseña (Normalmente el numero de cedula), luego de haber iniciado sesion un paciente puede revisar y descargar los archivos que le ha enviado su medico, entre ellos videos de ecografias

## Ejecutar el codigo localmente

### En las carpetas Backend y frontend ejecutar los siguientes comandos:

``````
npm i
npm run dev
``````

Acceder a la aplicacion web:

``````
http://localhost:3000
``````

## Ejecutar el codigo con docker

### Tener en cuenta

Asegurese de que las variable de entorno esten definidas:

NEXT_PUBLIC_API_URL apunta a la direccion IP de la maquina en la que se encuentra el proyecto.
Las variables de entorno del backend deben estar implementadas

Luego utilice un archivo docker-compose.yml para levantar los dos servicios (Backend y Frontend) a partir de los Dockerfile que se encuentran en sus respectivas carpetas

### Ejecutar docker compose:

``````
docker-compose up --build -d
``````

Acceda mediante el navegador a la url http://<La_Direccion_IP_de_su_Maquina_Virtual>:3000 o http://localhost:3000 dependiendo de su entorno de desarrollo
