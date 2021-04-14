import cloudinary from 'cloudinary';
import {cloudinary as cloudinaryConfig} from '../config/index.config';

cloudinary.v2.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

export {cloudinary};
