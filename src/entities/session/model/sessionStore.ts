import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Credentials } from '@/shared/api'
import { messenger } from '@/shared/config'

interface SessionState {
  credentials: Credentials | null
  setCredentials: (credentials: Credentials) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (credentials) => set({ credentials }),
    }),
    {
      name: `green-api-chat:${messenger.id}:session`,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
