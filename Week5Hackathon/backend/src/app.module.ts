import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; // Keep this
import { UserModule } from './users/users.module';
import { AuctionModule } from './auction/auctions.module';
import { AuthModule } from './auth/auth.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [
    // 1. Load Environment Variables globally
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Initialize the Scheduler globally
    ScheduleModule.forRoot(),

    // 3. Database Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // 4. Feature Modules
    UserModule,
    AuctionModule,
    AuthModule,
    BidModule,
  ],
})
export class AppModule {}