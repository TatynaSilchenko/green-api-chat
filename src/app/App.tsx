import { useChatStore } from '@/entities/chat'
import { ChatPage } from '@/pages/chat'
import { StartPage } from '@/pages/start'

export function App() {
  const hasChat = useChatStore((state) => state.chat !== null)

  return hasChat ? <ChatPage /> : <StartPage />
}
