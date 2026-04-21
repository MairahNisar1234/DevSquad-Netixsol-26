import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // Use built-in Node.js streams

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  async uploadImage(file: Express.Multer.File): Promise<string> {
    this.logger.log(`Initiating upload for: ${file.originalname}`);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'smart_pos_products' },
        (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary Error: ${error.message}`);
            return reject(new InternalServerErrorException('Cloudinary upload failed'));
          }
          if (!result) return reject(new Error('Upload result is empty'));

          this.logger.log(`SUCCESS: ${result.secure_url}`);
          resolve(result.secure_url);
        },
      );

      // FIX: Use built-in Readable instead of buffer-to-stream
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null); 
      stream.pipe(upload);
      
      this.logger.verbose('Streaming file buffer to Cloudinary...');
    });
  }
}