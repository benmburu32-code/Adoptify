import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext.jsx'

// A tiny component that exposes whatever AuthContext currently holds.
function Consumer() {
  const { user, loading } = useAuth()
  if (loading) return <p>loading</p>
  return <p>{user ? `signed in as ${user.email}` : 'signed out'}</p>
}

describe('AuthContext', () => {
  it('starts as loading and resolves to signed-out when Firebase has no user', async () => {
    const { findByText, getByText } = render(
      <AuthProvider><Consumer /></AuthProvider>
    )
    // first paint is the loading state
    expect(getByText('loading')).toBeInTheDocument()
    // default mock fires the listener with null → loading false, no user
    expect(await findByText('signed out')).toBeInTheDocument()
  })

  it('reports the user when Firebase emits one', async () => {
    const fb = globalThis.fb
    // capture the listener so we can fire it ourselves, like a real login
    fb.onAuthStateChanged.mockImplementation((auth, cb) => {
      fb._cb = cb
      return () => {}
    })

    const { findByText } = render(<AuthProvider><Consumer /></AuthProvider>)
    // The listener is registered inside setPersistence().then(...), so it is
    // attached on a microtask — wait for it before firing it.
    await waitFor(() => expect(fb._cb).toBeDefined())
    fb._cb({ uid: '123', email: 'abbie@test.com' })
    expect(await findByText('signed in as abbie@test.com')).toBeInTheDocument()
  })

  it('returns null when useAuth is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Lonely() {
      const value = useAuth()
      return <p>{value === null ? 'no provider' : 'has provider'}</p>
    }
    const { getByText } = render(<Lonely />)
    expect(getByText('no provider')).toBeInTheDocument()
    spy.mockRestore()
  })
})
