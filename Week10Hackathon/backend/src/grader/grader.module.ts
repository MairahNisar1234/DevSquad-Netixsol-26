import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { GraderService } from './grader.service';
import { GraderController } from './grader.controller';
import { Submission, SubmissionSchema } from './schemas/submission.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema }
    ]),
  ],
  providers: [GraderService],
  controllers: [GraderController],
})
export class GraderModule {}