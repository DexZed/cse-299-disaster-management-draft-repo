import {z} from 'zod';
import {createZodDto} from 'nestjs-zod';

const ChatMessageSchema = z.object({
    role: z.enum(['user','model']),
    content: z.string()
})

const ChatCompletionSchema = z.object({
    model: z.string().optional(),
    temperature: z.number().optional(),
    max_tokens: z.number().optional(),
    top_p: z.number().optional(),
    frequency_penalty: z.number().optional(),
    presence_penalty: z.number().optional(),
    stop: z.array(z.string()).optional(),
    messages: z.array(ChatMessageSchema)
})

export class CreateChatCompletionDto extends createZodDto(ChatCompletionSchema){}


export class ChatMessageDto extends createZodDto(ChatMessageSchema){}
