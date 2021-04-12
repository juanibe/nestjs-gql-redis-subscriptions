import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubSub } from 'graphql-subscriptions';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingPongResolvers } from './ping-pong.resolver';
import * as Redis from 'ioredis';


@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PingPongResolvers,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: 'localhost',
          port: 6379
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
})
export class AppModule { }
