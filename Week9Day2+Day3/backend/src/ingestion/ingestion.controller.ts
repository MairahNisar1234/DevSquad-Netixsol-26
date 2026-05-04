import { Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Triggers the bulk ingestion process defined in the service.
   * This endpoint will process match, team, and summary CSVs.
   */
  @Post('start-bulk')
  async startBulkIngestion() {
    // We call the service method that handles the tasks array and the file paths internally
    const report = await this.ingestionService.startBulkIngestion();

    return {
      message: 'Bulk Ingestion Processed',
      report,
    };
  }
}