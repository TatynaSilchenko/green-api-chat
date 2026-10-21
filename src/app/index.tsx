import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installMockApi } from '@/shared/api'
import { IS_API_MOCK, messenger } from '@/shared/config'
import './styles/index.css'
import { App } from './App'

if (IS_API_MOCK) installMockApi()

document.title = `${messenger.name} — GREEN-API Chat`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
