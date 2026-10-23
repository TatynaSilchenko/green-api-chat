import { useEffect, useRef } from 'react'
import { useChatStore } from '@/entities/chat'
import { MessageBubble, useMessageStore } from '@/entities/message'
import { useReceiveMessages } from '@/features/receive-messages'
import { MessageInput } from '@/features/send-message'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const chat = useChatStore((state) => state.chat)
  const messages = useMessageStore((state) => (chat ? state.byChat[chat.id] : undefined))
  const receiveError = useReceiveMessages()
  const listRef = useRef<HTMLDivElement>(null)
  const atBottomRef = useRef(true)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (atBottomRef.current || messages?.at(-1)?.direction === 'out') {
      list.scrollTop = list.scrollHeight
    }
  }, [messages])

  if (!chat) return null

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
          </svg>
        </span>
        <h1 className={styles.title}>+{chat.phone}</h1>
      </header>
      {receiveError && (
        <p className={styles.error} role="alert">
          {receiveError}
        </p>
      )}
      <div
        ref={listRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
        onScroll={(event) => {
          const list = event.currentTarget
          atBottomRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 80
        }}
      >
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
