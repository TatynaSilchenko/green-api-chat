export { messenger } from './messenger'
export type { MessengerConfig, MessengerId } from './messenger'

export const API_URL = (import.meta.env.VITE_API_URL || 'https://api.green-api.com').replace(
  /\/+$/,
  '',
)

export const IS_API_MOCK = import.meta.env.DEV && import.meta.env.VITE_API_MOCK === 'true'
