import { expect, it } from 'vitest'
import { fromNotification } from './fromNotification'

it('turns an incoming text notification into a message', () => {
  expect(
    fromNotification({
      typeWebhook: 'incomingMessageReceived',
      idMessage: '42',
      timestamp: 1763115112,
      senderData: { chatId: '10000000' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    }),
  ).toEqual({
    id: '42',
    chatId: '10000000',
    text: 'Привет',
    direction: 'in',
    timestamp: 1763115112000,
  })
})
