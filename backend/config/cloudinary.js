import { v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    secure: true
});
  
export const uploadAndGetURL = async (imageData) => {
    const result = await cloudinary.uploader.upload(imageData);
    const url = cloudinary.url(result.public_id);
    return url;
}