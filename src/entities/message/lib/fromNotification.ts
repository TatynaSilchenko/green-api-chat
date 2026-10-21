import type { NotificationBody } from '@/shared/api'
import type { Message } from '../model/types'

const directions: Partial<Record<string, Message['direction']>> = {
  incomingMessageReceived: 'in',
  outgoingAPIMessageReceived: 'out',
}

export function fromNotification(body: NotificationBody): Message | null {
  const direction = directions[body.typeWebhook]
  const text =
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.text
  if (!direction || !body.idMessage || !body.senderData || text === undefined) return null

  return {
    id: body.idMessage,
    chatId: body.senderData.chatId,
    text,
    direction,
    timestamp: (body.timestamp ?? Date.now() / 1000) * 1000,
  }
}
