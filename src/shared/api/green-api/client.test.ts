import { afterEach, expect, it, vi } from 'vitest'
import { receiveNotification } from './client'

afterEach(() => {
  vi.unstubAllGlobals()
})

it('returns null when the notification queue is empty', async () => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response('null')))

  await expect(
    receiveNotification({ idInstance: '1101000001', apiTokenInstance: 'token' }),
  ).resolves.toBeNull()
})
