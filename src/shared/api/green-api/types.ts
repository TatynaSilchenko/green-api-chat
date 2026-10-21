export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export interface CheckAccountResponse {
  exist: boolean
  chatId: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface NotificationBody {
  typeWebhook: string
  idMessage?: string
  timestamp?: number
  senderData?: {
    chatId: string
    chatName?: string
    senderName?: string
  }
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string }
  }
}

export interface Notification {
  receiptId: number
  body: NotificationBody
}
