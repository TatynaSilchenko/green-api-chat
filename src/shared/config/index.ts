export { messenger, resolveMessenger } from './messenger'
export type { MessengerConfig, MessengerId } from './messenger'

export const DEFAULT_API_URL = import.meta.env.VITE_DEFAULT_API_URL || 'https://api.green-api.com'

/** Fake in-memory GREEN-API for development without an instance; never enabled in production builds */
export const IS_API_MOCK = import.meta.env.DEV && import.meta.env.VITE_API_MOCK === 'true'
