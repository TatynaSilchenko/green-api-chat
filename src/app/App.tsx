import { IS_API_MOCK, messenger } from '@/shared/config'

export function App() {
  return (
    <p>
      {messenger.name} chat — {IS_API_MOCK ? 'mock API' : 'GREEN-API'}
    </p>
  )
}
