import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(@InjectConnection() private connection: Connection) {}

  async startBulkIngestion() {
    const report: any[] = [];
    
    // Updated path logic: usually data is in a root folder 'scripts/data' or 'src/data'
    // Adjust 'src', 'data' to match your actual folder structure
    const dataDir = path.join(process.cwd(), 'src', 'data'); 
    
    const tasks = [
      { fileName: 'match_by_match_cleaned.csv', collection: 'matches' },
      { fileName: 'team_data_cleaned.csv', collection: 'teams' },
      { fileName: 'year_by_year_cleaned.csv', collection: 'summaries' },
      { fileName: 'player_info.csv', collection: 'player_info' }, 
    ];

    for (const task of tasks) {
      const filePath = path.join(dataDir, task.fileName);
      this.logger.log(`Starting ingestion for: ${task.fileName}`);
      
      try {
        const result = await this.processFile(filePath, task.collection);
        report.push({ file: task.fileName, ...result });
        this.logger.log(`Successfully ingested ${task.fileName}`);
      } catch (error: any) {
        this.logger.error(`Failed to ingest ${task.fileName}: ${error.message}`);
        report.push({ file: task.fileName, status: 'Error', error: error.message });
      }
    }
    return report;
  }

  private async processFile(filePath: string, collectionName: string): Promise<any> {
    const results: Record<string, any>[] = [];

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File not found at: ${filePath}`));
      }

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: any) => {
          const processedRow: Record<string, any> = {};
          for (const key in row) {
            const val = row[key]?.trim();
            
            // Smart conversion: Only convert to Number if it's a valid digit string
            // and not an empty string or a field like 'player_id' which is numeric but shouldn't be null
            processedRow[key] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
          }
          results.push(processedRow);
        })
        .on('end', async () => {
          try {
            const db = this.connection.db;
            if (!db) {
              return reject(new Error('Database connection not established'));
            }
            
            const collection = db.collection(collectionName);
            
            // Clear existing data to avoid duplicates during re-runs
            await collection.deleteMany({});
            
            if (results.length > 0) {
              // Batch insert for performance
              await collection.insertMany(results);
            }
            
            resolve({ status: 'Success', count: results.length });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => reject(err));
    });
  }
}