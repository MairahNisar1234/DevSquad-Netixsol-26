import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { GraderService } from './grader.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('grader')
export class GraderController {
  constructor(
    private readonly graderService: GraderService,
  ) {}

  @Post('upload-batch')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
    }),
  )
  async uploadBatch(
    @UploadedFiles()
    files: Express.Multer.File[],

    @Body('prompt')
    prompt: string,

    /**
     * 🔥 NEW
     */
    @Body('assignmentTitle')
    assignmentTitle: string,

    @Body('markingMode')
    markingMode: 'strict' | 'loose',

    @Req() req: any,
  ) {
    if (!files?.length) {
      throw new BadRequestException(
        'No files uploaded',
      );
    }

    if (!prompt?.trim()) {
      throw new BadRequestException(
        'Prompt is required',
      );
    }

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    if (!userId) {
      throw new BadRequestException(
        'User not found',
      );
    }

    return this.graderService.processAssignments(
      files,
      prompt,
      assignmentTitle,
      markingMode || 'loose',
      userId,
    );
  }

  /**
   * 🔥 NEW HISTORY ENDPOINT
   */
  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getHistory(@Req() req: any) {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.sub;

    if (!userId) {
      throw new BadRequestException(
        'User not found',
      );
    }

    return this.graderService.getHistory(
      userId,
    );
  }
}