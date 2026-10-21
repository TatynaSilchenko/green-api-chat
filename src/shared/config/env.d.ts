// Client-side env variables (only VITE_* reach the bundle). Read them in shared/config only.
interface ImportMetaEnv {
  readonly VITE_MESSENGER?: string
  readonly VITE_DEFAULT_API_URL?: string
  readonly VITE_API_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
