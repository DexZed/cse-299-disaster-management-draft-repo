import { z } from 'zod';
declare const CreateChatCompletionDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodOptional<z.ZodNumber>;
    presence_penalty: z.ZodOptional<z.ZodNumber>;
    stop: z.ZodOptional<z.ZodArray<z.ZodString>>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            model: "model";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class CreateChatCompletionDto extends CreateChatCompletionDto_base {
}
declare const ChatMessageDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        model: "model";
    }>;
    content: z.ZodString;
}, z.core.$strip>> & {
    io: "input";
};
export declare class ChatMessageDto extends ChatMessageDto_base {
}
export {};
