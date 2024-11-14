const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// Ruta del archivo AVI de entrada y del archivo MP4 de salida
const inputPath = path.join(__dirname, 'video.avi');
const outputPath = path.join(__dirname, 'video.mp4');

// Convertir AVI a MP4
ffmpeg(inputPath)
  .output(outputPath)
  .on('end', () => {
    console.log('Conversión completada.');
  })
  .on('error', (err) => {
    console.error('Error durante la conversión: ' + err.message);
  })
  .run();
