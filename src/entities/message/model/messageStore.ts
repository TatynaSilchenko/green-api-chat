import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Message } from './types'

interface MessageState {
  byChat: Record<string, Message[]>
  add: (message: Message) => void
  markFailed: (chatId: string, id: string) => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      byChat: {},
      add: (message) =>
        set((state) => {
          const messages = state.byChat[message.chatId] ?? []
          if (messages.some((item) => item.id === message.id)) return state
          return { byChat: { ...state.byChat, [message.chatId]: [...messages, message] } }
        }),
      markFailed: (chatId, id) =>
        set((state) => {
          const messages = state.byChat[chatId]
          if (!messages?.some((item) => item.id === id)) return state
          return {
            byChat: {
              ...state.byChat,
              [chatId]: messages.map((item) => (item.id === id ? { ...item, failed: true } : item)),
            },
          }
        }),
    }),
    {
      name: 'green-api-chat:messages',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
