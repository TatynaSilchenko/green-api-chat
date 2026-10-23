import { useState } from 'react'
import { useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { CredentialsForm } from '@/features/set-credentials'
import styles from './StartPage.module.css'

export function StartPage() {
  const hasCredentials = useSessionStore((state) => state.credentials !== null)
  const [editing, setEditing] = useState(false)
  const showChatForm = hasCredentials && !editing

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{showChatForm ? 'Новый чат' : 'MAX через GREEN-API'}</h1>
        </header>
        {showChatForm ? (
          <>
            <CreateChatForm />
            <button type="button" className={styles.back} onClick={() => setEditing(true)}>
              <span aria-hidden="true">←</span> Изменить данные инстанса
            </button>
          </>
        ) : (
          <CredentialsForm onSave={() => setEditing(false)} />
        )}
      </section>
    </main>
  )
}
