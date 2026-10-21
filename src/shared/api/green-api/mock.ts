import type { Credentials, Notification, NotificationBody } from './types'

export const MOCK_CREDENTIALS: Credentials = {
  idInstance: '1101000001',
  apiTokenInstance: 'mock-token',
}
export const MOCK_PHONE = '+7 999 123-45-67'

const queue: Notification[] = []
const waiters = new Set<() => void>()
let lastReceiptId = 0
let lastMessageId = 0

function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function enqueue(body: NotificationBody) {
  lastReceiptId += 1
  queue.push({ receiptId: lastReceiptId, body })
  for (const wake of [...waiters]) wake()
}

function messageBody(
  typeWebhook: string,
  chatId: string,
  idMessage: string,
  text: string,
): NotificationBody {
  return {
    typeWebhook,
    idMessage,
    timestamp: Math.floor(Date.now() / 1000),
    senderData: { chatId, senderName: 'Тестовый собеседник' },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: text } },
  }
}

function waitForNotification(signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    const finish = () => {
      clearTimeout(timer)
      waiters.delete(finish)
      resolve()
    }
    const timer = setTimeout(finish, 20_000)
    waiters.add(finish)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        waiters.delete(finish)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

function readBody(init?: RequestInit): Record<string, unknown> {
  return typeof init?.body === 'string' ? JSON.parse(init.body) : {}
}

async function handle(method: string, extra: string | undefined, init?: RequestInit) {
  switch (method) {
    case 'checkAccount':
      return json({ exist: true, chatId: String(readBody(init).phoneNumber) })

    case 'sendMessage': {
      const { chatId, message } = readBody(init)
      lastMessageId += 1
      const idMessage = `mock-${lastMessageId}`
      enqueue(messageBody('outgoingAPIMessageReceived', String(chatId), idMessage, String(message)))
      setTimeout(() => {
        lastMessageId += 1
        const reply = `Ответ на «${String(message)}»`
        enqueue(
          messageBody('incomingMessageReceived', String(chatId), `mock-${lastMessageId}`, reply),
        )
      }, 1500)
      return json({ idMessage })
    }

    case 'receiveNotification':
      if (queue.length === 0) await waitForNotification(init?.signal)
      return json(queue[0] ?? null)

    case 'deleteNotification': {
      const index = queue.findIndex((item) => item.receiptId === Number(extra))
      if (index !== -1) queue.splice(index, 1)
      return json({ result: true })
    }

    default:
      return new Response('', { status: 404 })
  }
}

export function installMockApi() {
  const realFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = (input, init) => {
    if (input instanceof Request || !String(input).includes('/waInstance')) {
      return realFetch(input, init)
    }
    const segments = new URL(String(input)).pathname.split('/').filter(Boolean)
    const index = segments.findIndex((segment) => segment.startsWith('waInstance'))
    return handle(segments[index + 1], segments[index + 3], init)
  }
}
