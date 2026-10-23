import { useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { CredentialsForm } from '@/features/set-credentials'
import styles from './StartPage.module.css'

export function StartPage() {
  const hasCredentials = useSessionStore((state) => state.credentials !== null)
  const setCredentials = useSessionStore((state) => state.setCredentials)

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{hasCredentials ? 'Новый чат' : 'MAX через GREEN-API'}</h1>
        </header>
        {hasCredentials ? (
          <>
            <CreateChatForm />
            <button type="button" className={styles.back} onClick={() => setCredentials(null)}>
              ← Изменить данные инстанса
            </button>
          </>
        ) : (
          <CredentialsForm />
        )}
      </section>
    </main>
  )
}
