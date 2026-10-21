import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { messenger } from '@/shared/config'

export interface Chat {
  id: string
  phone: string
}

interface ChatState {
  chat: Chat | null
  setChat: (chat: Chat) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chat: null,
      setChat: (chat) => set({ chat }),
    }),
    {
      name: `green-api-chat:${messenger.id}:chat`,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
