import { useEffect, useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { fromNotification, useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import {
  GreenApiError,
  deleteNotification,
  receiveNotification,
  type Credentials,
} from '@/shared/api'

const RETRY_DELAY_MS = 3000

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })
}

async function pollNotifications(
  credentials: Credentials,
  signal: AbortSignal,
  onError: (message: string | null) => void,
) {
  while (!signal.aborted) {
    try {
      const notification = await receiveNotification(credentials, signal)
      if (notification) {
        const { body } = notification
        const message = fromNotification(body)
        if (message && message.chatId === useChatStore.getState().chat?.id) {
          useMessageStore.getState().add(message)
        }
        if (body.typeWebhook === 'outgoingMessageStatus' && body.status === 'failed') {
          if (body.chatId && body.idMessage) {
            useMessageStore.getState().markFailed(body.chatId, body.idMessage)
          }
        }
        await deleteNotification(credentials, notification.receiptId)
      }
      onError(null)
    } catch (caught) {
      if (signal.aborted) return
      if (caught instanceof GreenApiError && caught.status === 401) {
        onError(caught.message)
        return
      }
      onError('Нет связи с GREEN-API, пробуем снова…')
      await wait(RETRY_DELAY_MS, signal)
    }
  }
}

export function useReceiveMessages() {
  const credentials = useSessionStore((state) => state.credentials)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!credentials) return
    const controller = new AbortController()
    void pollNotifications(credentials, controller.signal, setError)
    return () => controller.abort()
  }, [credentials])

  return error
}
