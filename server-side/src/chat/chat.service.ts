import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GoogleGenAI } from '@google/genai';
import { ChatMessageDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
 
  constructor(private readonly googleGenAI: GoogleGenAI){}
  handlerMessage(message:any){
    console.log(message)
    return `Received: ${message}`;
  }
  async generateTextStream(messages:ChatMessageDto[], onChunk:(chunk:string | undefined)=>void) {
    const chat = this.googleGenAI.chats.create({
      model:'gemini-2.5-flash',
      config:{
        systemInstruction:"Responses should be in proper markdown format."
      },
      history:messages?.map((message)=>({
        role:message.role,
        parts:[{text:message.content}]
      }))
    });
    const lastMessage = messages[messages?.length-1];
    if (!lastMessage) throw new Error('No last message found');
    const stream = await chat.sendMessageStream({message:lastMessage.content});
    for await (const chunk of stream){
      onChunk(chunk.text);
    }
  }

  // NEEDS APP SPECIFIC LLM TEXT AND EMBEDDING FROM SUPABASE
 async create(messages:ChatMessageDto[], onChunk:(chunk:string | undefined)=>void) {
    const chat = this.googleGenAI.chats.create({
      model:'gemini-2.5-flash',
      config:{
        systemInstruction:"Response should be in proper markdown format."
      },
      history:messages?.map((message)=>({
        role:message.role,
        parts:[{text:message.content}]
      }))
    });
    const lastMessage = messages[messages?.length-1];
    if (!lastMessage) throw new Error('No last message found');
    const stream = await chat.sendMessageStream({message:lastMessage.content});
    for await (const chunk of stream){
      onChunk(chunk.text);
    }
  }

  // findAll() {
  //   return `This action returns all chat`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
