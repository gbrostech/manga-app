# Instrucciones para ejecutar la aplicación Mangas ESP localmente

Este archivo contiene las instrucciones para ejecutar tanto el frontend como el backend de la aplicación Mangas ESP en tu máquina local.

## Requisitos previos

- Node.js (versión 16 o superior)
- npm (normalmente viene con Node.js)

## Estructura de archivos

El proyecto está organizado en dos carpetas principales:
- La carpeta raíz contiene el código del frontend (React)
- La carpeta `manga-app-backend` contiene el código del backend (Node.js/Express)

## Configuración del Backend

1. Abre una terminal y navega a la carpeta del backend:
   ```
   cd manga-app-backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el servidor:
   ```
   npm start
   ```

El servidor backend se ejecutará en `http://localhost:5000` por defecto.

## Configuración del Frontend

1. Abre una nueva terminal (mantén la del backend ejecutándose) y navega a la carpeta raíz del proyecto:
   ```
   cd ..
   ```
   (Si ya estás en la carpeta raíz, omite este paso)

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia la aplicación en modo desarrollo:
   ```
   npm start
   ```

La aplicación frontend se ejecutará en `http://localhost:3000` y se abrirá automáticamente en tu navegador.

## Solución de problemas comunes

Si encuentras errores como "Module not found", asegúrate de:
1. Estar en el directorio correcto al ejecutar los comandos
2. Haber instalado todas las dependencias con `npm install`
3. No tener anidación adicional de carpetas (los archivos package.json deben estar directamente en la carpeta raíz y en manga-app-backend)

## Conexión entre Frontend y Backend

El frontend está configurado para conectarse al backend en `http://localhost:5000`. Si necesitas cambiar esta configuración, puedes modificar el archivo `src/api/api.js`.

## Construcción para producción

Si deseas construir la aplicación para producción:

1. En la carpeta del frontend (raíz):
   ```
   npm run build
   ```

2. Esto creará una carpeta `build` con los archivos optimizados que puedes desplegar en cualquier servidor web estático.

## Notas adicionales

- La aplicación utiliza Tailwind CSS para los estilos
- Las imágenes de muestra se encuentran en la carpeta `public/images`
- Los datos de muestra se cargan desde el backend a través de la API

Si tienes alguna pregunta o problema, no dudes en contactarme.

¡Disfruta de tu aplicación de mangas!
