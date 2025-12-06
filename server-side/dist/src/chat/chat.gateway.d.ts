import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatCompletionDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnModuleInit {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    onModuleInit(): void;
    handleMessage(client: Socket, message: any): void;
    generateMessage(client: Socket, body: CreateChatCompletionDto): Promise<void>;
    create(client: Socket, body: CreateChatCompletionDto): Promise<void>;
}
