interface ImportMetaEnv {
  readonly VITE_MESSENGER?: string
  readonly VITE_API_URL?: string
  readonly VITE_API_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
