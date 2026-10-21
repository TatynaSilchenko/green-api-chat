export type MessengerId = 'telegram' | 'max'

export interface MessengerConfig {
  id: MessengerId
  name: string
  phoneCodes: string[] | null
  maxMessageLength: number
}

const messengers: Record<MessengerId, MessengerConfig> = {
  telegram: { id: 'telegram', name: 'Telegram', phoneCodes: null, maxMessageLength: 4096 },
  max: { id: 'max', name: 'MAX', phoneCodes: ['7', '375'], maxMessageLength: 4000 },
}

function resolveMessenger(value: string): MessengerConfig {
  if (!Object.hasOwn(messengers, value)) {
    const allowed = Object.keys(messengers).join(', ')
    throw new Error(`VITE_MESSENGER="${value}" is not supported, use one of: ${allowed}`)
  }
  return messengers[value as MessengerId]
}

export const messenger = resolveMessenger(import.meta.env.VITE_MESSENGER || 'telegram')
