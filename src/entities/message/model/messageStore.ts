import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { messenger } from '@/shared/config'
import type { Message } from './types'

interface MessageState {
  byChat: Record<string, Message[]>
  add: (message: Message) => void
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
    }),
    {
      name: `green-api-chat:${messenger.id}:messages`,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
