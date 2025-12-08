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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let ChatService = class ChatService {
    googleGenAI;
    constructor(googleGenAI) {
        this.googleGenAI = googleGenAI;
    }
    handlerMessage(message) {
        console.log(message);
        return `Received: ${message}`;
    }
    async generateTextStream(messages, onChunk) {
        const chat = this.googleGenAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Responses should be in proper markdown format."
            },
            history: messages?.map((message) => ({
                role: message.role,
                parts: [{ text: message.content }]
            }))
        });
        const lastMessage = messages[messages?.length - 1];
        if (!lastMessage)
            throw new Error('No last message found');
        const stream = await chat.sendMessageStream({ message: lastMessage.content });
        for await (const chunk of stream) {
            onChunk(chunk.text);
        }
    }
    async create(messages, onChunk) {
        const chat = this.googleGenAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Response should be in proper markdown format."
            },
            history: messages?.map((message) => ({
                role: message.role,
                parts: [{ text: message.content }]
            }))
        });
        const lastMessage = messages[messages?.length - 1];
        if (!lastMessage)
            throw new Error('No last message found');
        const stream = await chat.sendMessageStream({ message: lastMessage.content });
        for await (const chunk of stream) {
            onChunk(chunk.text);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [genai_1.GoogleGenAI])
], ChatService);
//# sourceMappingURL=chat.service.js.map