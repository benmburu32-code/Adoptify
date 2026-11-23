import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import ProtectedRoute from '../ProtectedRoute.jsx'

function renderAt(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={<ProtectedRoute><p>secret dashboard</p></ProtectedRoute>}
          />
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('shows a loading state while the session is being checked', () => {
    // never fire the auth listener → loading stays true
    globalThis.fb.onAuthStateChanged.mockImplementation(() => () => {})
    renderAt('/dashboard')
    expect(screen.getByText(/Checking your session/)).toBeInTheDocument()
  })

  it('redirects to /login when there is no user', async () => {
    renderAt('/dashboard')
    expect(await screen.findByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('secret dashboard')).not.toBeInTheDocument()
  })

  it('renders the protected content when there is a user', async () => {
    globalThis.fb.auth.currentUser = { uid: 'u1', email: 'a@b.com' }
    renderAt('/dashboard')
    expect(await screen.findByText('secret dashboard')).toBeInTheDocument()
  })
})
