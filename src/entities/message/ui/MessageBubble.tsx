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
      <time className={styles.time} dateTime={new Date(message.timestamp).toISOString()}>
        {timeFormat.format(message.timestamp)}
      </time>
    </div>
  )
}
