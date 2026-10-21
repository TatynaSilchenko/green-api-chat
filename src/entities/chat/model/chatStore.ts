import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { messenger } from '@/shared/config'

export interface Chat {
  id: string
  phone: string
}

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  addChat: (chat: Chat) => void
  openChat: (id: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      addChat: (chat) =>
        set((state) =>
          state.chats.some((item) => item.id === chat.id)
            ? state
            : { chats: [...state.chats, chat] },
        ),
      openChat: (id) => set({ activeChatId: id }),
    }),
    {
      name: `green-api-chat:${messenger.id}:chats`,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
