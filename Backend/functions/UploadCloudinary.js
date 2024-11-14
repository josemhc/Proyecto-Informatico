import { v2 as cloudinary } from 'cloudinary';

export const uploadCloudinary = async (outputPath) => {
    cloudinary.config({ 
        cloud_name: 'dvwgu2fqj', 
        api_key: '526943544326771', 
        api_secret: 'LkpjT9BLS23v290SkRHqgyEG3AI' 
      });
try{
    // Configuracion de cloudinary
    const response = await cloudinary.uploader.upload(outputPath, { resource_type: "video" });
    console.log(response.secure_url);
}catch (error) {
    console.error('Error al guardar el video:', error);
}
}