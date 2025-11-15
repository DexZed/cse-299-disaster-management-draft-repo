import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatCompletionDto } from './dto/create-chat.dto';
import { Server } from 'socket.io';

// TODO: change origin for development
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: any): void {
    const result = this.chatService.handlerMessage(message);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: result,
    });
  }
@SubscribeMessage('generateText')
generateMessage(@MessageBody() body:CreateChatCompletionDto ){
  if (!body.messages || body.messages.length === 0) {
    this.server.emit('onMessage', {
      msg: 'Error',
      content: 'No messages provided',
    });
    return;
  }
  this.chatService.generateTextStream(body.messages,(chunk)=>{
    this.server.emit('onMessage',{
      msg:'Ai Response Chunk',
      content:chunk
    }
    )
  })
}
  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
