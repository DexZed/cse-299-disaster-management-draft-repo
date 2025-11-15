import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GoogleGenAI } from '@google/genai';
import { ChatMessageDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  // TODO : ADD Ai chat here 
  constructor(private readonly googleGenAI: GoogleGenAI){}
  handlerMessage(message:any){
    console.log(message)
    return `Received: ${message}`;
  }
  async generateTextStream(messages:ChatMessageDto[], onChunk:(chunk:string | undefined)=>void) {
    const chat = this.googleGenAI.chats.create({
      model:'gemini-2.5-flash',
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
  // create(createChatDto: CreateChatDto) {
  //   return 'This action adds a new chat';
  // }

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
