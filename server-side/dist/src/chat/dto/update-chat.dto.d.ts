import { ChatMessageDto } from './create-chat.dto';
declare const UpdateChatDto_base: import("@nestjs/mapped-types").MappedType<Partial<ChatMessageDto>>;
export declare class UpdateChatDto extends UpdateChatDto_base {
    id: number;
}
export {};
