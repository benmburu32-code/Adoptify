import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider><App /></AuthProvider>
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders the home page at /', async () => {
    renderApp('/')
    expect(await screen.findByText('Find your new best friend')).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', async () => {
    renderApp('/does-not-exist')
    expect(await screen.findByText(/Page not found/)).toBeInTheDocument()
  })
})
