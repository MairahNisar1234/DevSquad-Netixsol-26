"use server";

import { Controller, Post, Body, Res, HttpStatus, Logger, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  async getChatResponse(@Body('message') message: string, @Res() res: Response) {
    try {
      const result = await this.chatService.getAiResponse(message);
      return res.status(HttpStatus.OK).json(result);
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
  }

  // 🎤 NEW: Endpoint to handle audio file uploads
  @Post('speech-to-text')
  @UseInterceptors(FileInterceptor('file'))
  async transcribe(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'No file' });

    try {
      const text = await this.chatService.transcribeAudio(file);
      return res.status(HttpStatus.OK).json({ text });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Post('search')
  async searchProducts(@Body('query') query: string, @Res() res: Response) {
    try {
      const results = await this.chatService.searchProducts(query);
      return res.status(HttpStatus.OK).json(results);
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
  }
  @Post('symptom-checker')
async checkSymptoms(@Body('text') text: string) {
  return await this.chatService.analyzeSymptoms(text);
}
@Post('seed')
async seed() {
  return await this.chatService.seedSymptoms();
}
  
}