import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
   
    MongooseModule.forRoot('mongodb://mairah:m1234@ac-qmqmkfi-shard-00-00.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-01.fr9j8vv.mongodb.net:27017,ac-qmqmkfi-shard-00-02.fr9j8vv.mongodb.net:27017/nest-comments?ssl=true&replicaSet=atlas-pzvi1x-shard-0&authSource=admin'),
    CommentsModule,
    UsersModule,
  ],
})
export class AppModule {}


