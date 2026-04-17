import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: 'dru7ig67d',
      api_key: '299368268917529',
      api_secret: 'yEibqsy61peqch4MM23rWIZtWr8',
    });
    return cloudinary;
  },
};