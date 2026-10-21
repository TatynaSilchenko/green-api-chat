import { API_URL } from '@/shared/config'
import type { CheckAccountResponse, Credentials, Notification, SendMessageResponse } from './types'

export class GreenApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

function buildUrl({ idInstance, apiTokenInstance }: Credentials, method: string) {
  return `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

function isFailure(data: unknown): data is { status: false; reason: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    data.status === false &&
    'reason' in data &&
    typeof data.reason === 'string'
  )
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Неверный idInstance или apiTokenInstance'
        : `Ошибка GREEN-API (HTTP ${response.status})`
    throw new GreenApiError(message, response.status)
  }

  const text = await response.text()
  const data: unknown = text.trim() ? JSON.parse(text) : null
  if (isFailure(data)) throw new GreenApiError(data.reason, response.status)
  return data as T
}

function postJson(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export function checkAccount(credentials: Credentials, phoneNumber: number) {
  return request<CheckAccountResponse>(
    buildUrl(credentials, 'checkAccount'),
    postJson({ phoneNumber }),
  )
}

export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return request<SendMessageResponse>(
    buildUrl(credentials, 'sendMessage'),
    postJson({ chatId, message }),
  )
}

export function receiveNotification(credentials: Credentials, signal?: AbortSignal) {
  return request<Notification | null>(
    `${buildUrl(credentials, 'receiveNotification')}?receiveTimeout=20`,
    { signal },
  )
}

export function deleteNotification(credentials: Credentials, receiptId: number) {
  return request<unknown>(`${buildUrl(credentials, 'deleteNotification')}/${receiptId}`, {
    method: 'DELETE',
  })
}
