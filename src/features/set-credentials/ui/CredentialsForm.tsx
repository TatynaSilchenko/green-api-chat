import { useSessionStore } from '@/entities/session'
import styles from './CredentialsForm.module.css'

export function CredentialsForm() {
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
      }}
    >
      <label className={styles.field}>
        idInstance
        <input name="idInstance" defaultValue={credentials?.idInstance} required />
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
      <button type="submit">Продолжить</button>
    </form>
  )
}
