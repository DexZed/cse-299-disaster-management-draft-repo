"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    chatService;
    server;
    constructor(chatService) {
        this.chatService = chatService;
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');
        });
    }
    handleMessage(client, message) {
        const result = this.chatService.handlerMessage(message);
        client.emit('onMessage', {
            msg: 'New Message',
            content: result,
        });
    }
    async generateMessage(client, body) {
        console.log('Received Body:', body.messages);
        if (!body.messages || body.messages.length === 0) {
            client.emit('onMessage', {
                msg: 'Error',
                content: 'No messages provided',
            });
            return;
        }
        try {
            await this.chatService.generateTextStream(body.messages, (chunk) => {
                client.emit('onMessage', {
                    msg: 'Ai Response Chunk',
                    content: chunk,
                });
            });
            client.emit('streamComplete', {
                msg: 'Stream finished.',
            });
            console.log(`Stream complete for client: ${client.id}`);
        }
        catch (error) {
            console.error('Error during AI stream:', error);
            client.emit('onMessage', {
                msg: 'Error',
                content: '**[ERROR]** An error occurred during streaming.',
            });
        }
    }
    async create(client, body) {
        if (!body.messages || body.messages.length === 0) {
            client.emit('onMessage', {
                msg: 'Error',
                content: 'No messages provided',
            });
            return;
        }
        await this.chatService.create(body.messages, (chunk) => {
            client.emit('onMessage', {
                msg: "Ai Response Chunk",
                content: chunk
            });
        });
        client.emit('streamComplete', {
            msg: 'Stream finished.',
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('generateText'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_chat_dto_1.CreateChatCompletionDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "generateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('appAssistant'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_chat_dto_1.CreateChatCompletionDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "create", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat', cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map