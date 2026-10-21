import { describe, expect, it } from 'vitest'
import { resolveMessenger } from './messenger'

describe('resolveMessenger', () => {
  it('returns Telegram config without phone restrictions', () => {
    expect(resolveMessenger('telegram')).toMatchObject({
      name: 'Telegram',
      phoneCodes: null,
      maxMessageLength: 4096,
    })
  })

  it('returns MAX config limited to RU and BY numbers', () => {
    expect(resolveMessenger('max')).toMatchObject({
      name: 'MAX',
      phoneCodes: ['7', '375'],
      maxMessageLength: 4000,
    })
  })

  it('throws a readable error for an unknown value', () => {
    expect(() => resolveMessenger('whatsapp')).toThrow(
      'VITE_MESSENGER="whatsapp" is not supported, use one of: telegram, max',
    )
  })

  it('does not accept inherited object keys', () => {
    expect(() => resolveMessenger('toString')).toThrow()
  })
})
