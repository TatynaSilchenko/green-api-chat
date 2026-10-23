import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Credentials } from '@/shared/api'

interface SessionState {
  credentials: Credentials | null
  setCredentials: (credentials: Credentials | null) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (credentials) => set({ credentials }),
    }),
    {
      name: 'green-api-chat:session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
