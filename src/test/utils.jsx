import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'

// Helper: wraps a component in a MemoryRouter (so <Link>/<NavLink> work in
// tests) and optionally in the AuthProvider (so useAuth() works). Most
// component/page tests use this.
export function renderWithRouter(ui, { route = '/', withAuth = true } = {}) {
  const tree = withAuth ? <AuthProvider>{ui}</AuthProvider> : ui
  return render(<MemoryRouter initialEntries={[route]}>{tree}</MemoryRouter>)
}

// Shortcut to the shared Firebase fakes (see setupTests.js).
export function fb() {
  return globalThis.fb
}
