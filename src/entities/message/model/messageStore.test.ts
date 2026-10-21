import { expect, it } from 'vitest'
import { useMessageStore } from './messageStore'

it('keeps one copy of a message that arrives twice', () => {
  const message = {
    id: '42',
    chatId: '10000000',
    text: 'Привет',
    direction: 'out' as const,
    timestamp: 0,
  }

  useMessageStore.getState().add(message)
  useMessageStore.getState().add(message)

  expect(useMessageStore.getState().byChat['10000000']).toEqual([message])
})
