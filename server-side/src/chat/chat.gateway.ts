import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatCompletionDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';

// TODO: change origin for development
@WebSocketGateway({ namespace: 'chat', cors: true })
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
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: any): void {
    const result = this.chatService.handlerMessage(message);
    client.emit('onMessage', { // <-- Use client.emit
      msg: 'New Message',
      content: result,
    });
  }
  
  // FIX: Make handler async and add client socket as parameter
  @SubscribeMessage('generateText')
  async generateMessage(
    @ConnectedSocket() client: Socket, 
    @MessageBody() body: CreateChatCompletionDto
  ) {
    console.log('Received Body:', body.messages);
    if (!body.messages || body.messages.length === 0) {
      // Respond error only to the sender
      client.emit('onMessage', {
        msg: 'Error',
        content: 'No messages provided',
      });
      return;
    }

    try {
      // Await the entire streaming process to ensure it completes
      await this.chatService.generateTextStream(body.messages, (chunk) => {
        // Emit each chunk back ONLY to the originating client
        client.emit('onMessage', {
          msg: 'Ai Response Chunk',
          content: chunk,
        });
      });

      // ⬅️ PLACE THE COMPLETION EVENT HERE
      // 2. Emit the completion signal back ONLY to the originating client
      client.emit('streamComplete', {
        msg: 'Stream finished.',
      });
      console.log(`Stream complete for client: ${client.id}`);
      
    } catch (error) {
      console.error('Error during AI stream:', error);
      client.emit('onMessage', {
        msg: 'Error',
        content: '**[ERROR]** An error occurred during streaming.',
      });
    }
  }
  
  // You would need to apply the same await logic to appAssistant if it uses streaming.
  @SubscribeMessage('appAssistant')
  async create(@ConnectedSocket() client: Socket, @MessageBody() body:CreateChatCompletionDto) {
    if (!body.messages || body.messages.length === 0) {
      client.emit('onMessage', {
        msg: 'Error',
        content: 'No messages provided',
      });
      return;
    }
    
    // Assuming this.chatService.create is also an async streaming function that returns a Promise
    await this.chatService.create(body.messages,(chunk)=>{
      client.emit('onMessage',{
        msg:"Ai Response Chunk",
        content: chunk
      })
    });
    
    client.emit('streamComplete', {
        msg: 'Stream finished.',
    });
    
  }
  

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
