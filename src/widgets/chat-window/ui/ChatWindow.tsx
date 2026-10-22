import { useEffect, useRef } from 'react'
import { useChatStore } from '@/entities/chat'
import { MessageBubble, useMessageStore } from '@/entities/message'
import { useReceiveMessages } from '@/features/receive-messages'
import { MessageInput } from '@/features/send-message'
import { IS_API_MOCK } from '@/shared/config'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const chat = useChatStore((state) => state.chat)
  const messages = useMessageStore((state) => (chat ? state.byChat[chat.id] : undefined))
  const receiveError = useReceiveMessages()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  if (!chat) return null

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        +{chat.phone}
        {IS_API_MOCK && <span className={styles.badge}>mock</span>}
      </header>
      {receiveError && (
        <p className={styles.error} role="alert">
          {receiveError}
        </p>
      )}
      <div ref={listRef} className={styles.messages} role="log" aria-live="polite">
        {messages?.length ? (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        ) : (
          <p className={styles.empty}>Сообщений пока нет</p>
        )}
      </div>
      <MessageInput />
    </main>
  )
}
