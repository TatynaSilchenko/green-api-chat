import type { Message } from '../model/types'
import styles from './MessageBubble.module.css'

const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={message.direction === 'out' ? `${styles.bubble} ${styles.out}` : styles.bubble}>
      <span className={styles.text}>{message.text}</span>
      <span className={styles.meta}>
        {message.failed && <span className={styles.failed}>Не доставлено</span>}
        <time dateTime={new Date(message.timestamp).toISOString()}>
          {timeFormat.format(message.timestamp)}
        </time>
      </span>
    </div>
  )
}
