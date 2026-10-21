import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installMockApi } from '@/shared/api'
import { IS_API_MOCK } from '@/shared/config'
import './styles/index.css'
import { App } from './App'

if (IS_API_MOCK) installMockApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
