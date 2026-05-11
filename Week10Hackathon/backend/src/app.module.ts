import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GraderModule } from './grader/grader.module';

@Module({
  imports: [
    /**
     * 🔥 Global ENV access
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * 🔥 MongoDB Connection
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        uri: configService.get<string>(
          'MONGO_URI',
        ),

        /**
         * optional production settings
         */
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    /**
     * 🔥 Modules
     */
    AuthModule,
    GraderModule,
  ],
})
export class AppModule {}