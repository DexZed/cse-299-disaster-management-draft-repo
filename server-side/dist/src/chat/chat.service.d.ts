import { GoogleGenAI } from '@google/genai';
import { ChatMessageDto } from './dto/create-chat.dto';
export declare class ChatService {
    private readonly googleGenAI;
    constructor(googleGenAI: GoogleGenAI);
    handlerMessage(message: any): string;
    generateTextStream(messages: ChatMessageDto[], onChunk: (chunk: string | undefined) => void): Promise<void>;
    create(messages: ChatMessageDto[], onChunk: (chunk: string | undefined) => void): Promise<void>;
}
