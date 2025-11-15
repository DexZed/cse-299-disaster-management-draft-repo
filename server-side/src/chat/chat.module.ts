import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ChatGateway, ChatService,
    {
      provide: GoogleGenAI,
      useFactory:(configService: ConfigService)=>{
        return new GoogleGenAI({apiKey:configService.getOrThrow<string>('GEMINI_API_KEY')})
      },
      inject:[ConfigService]
    }
  ],
})
export class ChatModule {}
