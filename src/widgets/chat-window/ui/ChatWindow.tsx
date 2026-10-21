import { useChatStore } from '@/entities/chat'
import { IS_API_MOCK } from '@/shared/config'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const chat = useChatStore((state) => state.chat)

  if (!chat) return null

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        +{chat.phone}
        {IS_API_MOCK && <span className={styles.badge}>mock</span>}
      </header>
      <div className={styles.messages} role="log" aria-live="polite" />
    </main>
  )
}
