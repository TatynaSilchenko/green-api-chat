export interface Message {
  id: string
  chatId: string
  text: string
  direction: 'in' | 'out'
  timestamp: number
  failed?: boolean
}
