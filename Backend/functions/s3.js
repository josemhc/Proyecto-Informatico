import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from '../config.js'
import fs from 'fs';
import mime from 'mime-types';


const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY,

    }  
})

export async function uploadFiles(files, patientId) {
    const uploadResults = [];

    for (const file of files) {
        const stream = fs.createReadStream(file.path);
        const contentType = mime.lookup(file.originalname) || 'application/octet-stream'; // Detecta el tipo de contenido
        
        const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: file.originalname,
            Body: stream,
            ContentType: contentType // Establece el tipo de contenido
        };

        const command = new PutObjectCommand(uploadParams);

        try {
            const result = await client.send(command);
            console.log(result);
            const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${file.originalname}`;
            console.log(fileUrl);
            uploadResults.push(fileUrl);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            throw new Error('Error al subir uno o más archivos');
        }
    }

    return uploadResults;
}