'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from './actions'
import s from '../admin.module.css'

const initialState: LoginState = {}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} noValidate>
      {state.error && <div className={s.error} role="alert">{state.error}</div>}
      <div className={s.field}>
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} />
      </div>
      <div className={s.field}>
        <label htmlFor="admin-password">Contraseña</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
      </div>
      <button className={`${s.btn} ${s.btnPrimary}`} style={{ width: '100%' }} type="submit" disabled={pending}>
        {pending ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
