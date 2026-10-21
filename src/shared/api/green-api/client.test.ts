import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkAccount, receiveNotification, sendMessage } from './client'

const credentials = {
  apiUrl: 'https://api.green-api.com/',
  idInstance: '1101000001',
  apiTokenInstance: 'token',
}

function mockFetch(body: string, status = 200) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(body, { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GREEN-API client', () => {
  it('sends a message as JSON to the instance URL', async () => {
    const fetchMock = mockFetch('{"idMessage":"42"}')

    await expect(sendMessage(credentials, '10000000', 'Привет')).resolves.toEqual({
      idMessage: '42',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.green-api.com/waInstance1101000001/sendMessage/token',
      expect.objectContaining({ method: 'POST', body: '{"chatId":"10000000","message":"Привет"}' }),
    )
  })

  it('returns null when the notification queue is empty', async () => {
    mockFetch('null')
    await expect(receiveNotification(credentials)).resolves.toBeNull()
  })

  it('turns 401 into a readable error', async () => {
    mockFetch('', 401)
    await expect(receiveNotification(credentials)).rejects.toMatchObject({
      status: 401,
      message: 'Неверный idInstance или apiTokenInstance',
    })
  })

  it('treats HTTP 200 with {"status": false} as an error', async () => {
    mockFetch('{"status":false,"reason":"instance is starting or not authorized"}')
    await expect(checkAccount(credentials, 79991234567)).rejects.toThrow(
      'instance is starting or not authorized',
    )
  })
})
