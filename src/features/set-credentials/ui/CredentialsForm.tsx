import { useSessionStore } from '@/entities/session'
import styles from './CredentialsForm.module.css'

interface CredentialsFormProps {
  onSave?: () => void
}

export function CredentialsForm({ onSave }: CredentialsFormProps) {
  const credentials = useSessionStore((state) => state.credentials)
  const setCredentials = useSessionStore((state) => state.setCredentials)

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setCredentials({
          idInstance: String(data.get('idInstance')).trim(),
          apiTokenInstance: String(data.get('apiTokenInstance')).trim(),
        })
        onSave?.()
      }}
    >
      <label className={styles.field}>
        idInstance
        <input
          name="idInstance"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          defaultValue={credentials?.idInstance}
          required
        />
      </label>
      <label className={styles.field}>
        apiTokenInstance
        <input
          name="apiTokenInstance"
          type="password"
          autoComplete="off"
          defaultValue={credentials?.apiTokenInstance}
          required
        />
      </label>
      <button type="submit">Сохранить данные</button>
    </form>
  )
}
