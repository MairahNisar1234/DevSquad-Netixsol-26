import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY')!,
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')!,
    });
  }

  getSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!;
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')!;

    const signature = cloudinary.utils.api_sign_request(
      { 
        timestamp, 
        
      }, 
      apiSecret
    );

    return { 
      signature, 
      timestamp, 
      cloudName,
      apiKey
    };
  }
}