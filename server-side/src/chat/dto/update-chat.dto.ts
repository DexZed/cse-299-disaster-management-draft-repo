import { PartialType } from '@nestjs/mapped-types';
import { ChatMessageDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(ChatMessageDto) {
  id: number;
}
