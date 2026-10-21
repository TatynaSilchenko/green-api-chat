import { useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { GreenApiError, sendMessage } from '@/shared/api'
import { messenger } from '@/shared/config'
import styles from './MessageInput.module.css'

export function MessageInput() {
  const credentials = useSessionStore((state) => state.credentials)
  const chat = useChatStore((state) => state.chat)
  const addMessage = useMessageStore((state) => state.add)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function send() {
    const message = text.trim()
    if (!message || pending || !credentials || !chat) return

    setError(null)
    setPending(true)
    try {
      const { idMessage } = await sendMessage(credentials, chat.id, message)
      addMessage({
        id: idMessage,
        chatId: chat.id,
        text: message,
        direction: 'out',
        timestamp: Date.now(),
      })
      setText('')
    } catch (caught) {
      setError(caught instanceof GreenApiError ? caught.message : 'Не удалось отправить сообщение')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        void send()
      }}
    >
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.row}>
        <textarea
          className={styles.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              void send()
            }
          }}
          placeholder="Сообщение"
          aria-label="Сообщение"
          rows={1}
          maxLength={messenger.maxMessageLength}
        />
        <button type="submit" disabled={pending || !text.trim()}>
          Отправить
        </button>
      </div>
    </form>
  )
}
