import { useState, type FormEvent } from 'react'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { GreenApiError, MOCK_PHONE, checkAccount } from '@/shared/api'
import { IS_API_MOCK, messenger } from '@/shared/config'
import { normalizePhone } from '@/shared/lib'
import styles from './CreateChatForm.module.css'

function validatePhone(phone: string): string | null {
  if (phone.length < 10 || phone.length > 15) return 'Введите номер полностью, с кодом страны'
  const codes = messenger.phoneCodes
  if (codes && !codes.some((code) => phone.startsWith(code))) {
    return `${messenger.name} принимает только номера ${codes.map((code) => `+${code}`).join(' и ')}`
  }
  return null
}

export function CreateChatForm() {
  const credentials = useSessionStore((state) => state.credentials)
  const setChat = useChatStore((state) => state.setChat)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!credentials) return
    const phone = normalizePhone(String(new FormData(event.currentTarget).get('phone')))

    const problem = validatePhone(phone)
    if (problem) {
      setError(problem)
      return
    }

    setError(null)
    setPending(true)
    try {
      const { exist, chatId } = await checkAccount(credentials, Number(phone))
      if (!exist) {
        setError(`Номер не найден в ${messenger.name}`)
        return
      }
      setChat({ id: chatId, phone })
    } catch (caught) {
      setError(caught instanceof GreenApiError ? caught.message : 'Нет связи с GREEN-API')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Номер получателя
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="+7 999 123-45-67"
          defaultValue={IS_API_MOCK ? MOCK_PHONE : undefined}
          required
          aria-describedby={error ? 'create-chat-error' : undefined}
        />
      </label>
      {error && (
        <p id="create-chat-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? 'Проверяем номер…' : 'Создать чат'}
      </button>
    </form>
  )
}
