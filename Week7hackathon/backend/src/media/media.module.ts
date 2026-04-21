import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  providers: [
    CloudinaryProvider, 
    MediaService
  ],
  controllers: [MediaController],
 
  exports: [
    CloudinaryProvider, 
    MediaService
  ],
})
export class MediaModule {}