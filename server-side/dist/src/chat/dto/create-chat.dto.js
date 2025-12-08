"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageDto = exports.CreateChatCompletionDto = void 0;
const zod_1 = require("zod");
const nestjs_zod_1 = require("nestjs-zod");
const ChatMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'model']),
    content: zod_1.z.string()
});
const ChatCompletionSchema = zod_1.z.object({
    model: zod_1.z.string().optional(),
    temperature: zod_1.z.number().optional(),
    max_tokens: zod_1.z.number().optional(),
    top_p: zod_1.z.number().optional(),
    frequency_penalty: zod_1.z.number().optional(),
    presence_penalty: zod_1.z.number().optional(),
    stop: zod_1.z.array(zod_1.z.string()).optional(),
    messages: zod_1.z.array(ChatMessageSchema)
});
class CreateChatCompletionDto extends (0, nestjs_zod_1.createZodDto)(ChatCompletionSchema) {
}
exports.CreateChatCompletionDto = CreateChatCompletionDto;
class ChatMessageDto extends (0, nestjs_zod_1.createZodDto)(ChatMessageSchema) {
}
exports.ChatMessageDto = ChatMessageDto;
//# sourceMappingURL=create-chat.dto.js.map