import { describe, it, expect } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Navbar from '../Navbar.jsx'
import { renderWithRouter } from '../../test/utils.jsx'

describe('Navbar', () => {
  it('shows login/register links when logged out', async () => {
    renderWithRouter(<Navbar />)
    expect(await screen.findByText('Log in')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.getByText('Browse pets')).toBeInTheDocument()
    expect(screen.getByText('Discover')).toBeInTheDocument()
  })

  it('shows the user name and a log out button when logged in', async () => {
    globalThis.fb.auth.currentUser = { uid: 'u1', email: 'abbie@test.com', displayName: 'Abbie' }
    renderWithRouter(<Navbar />)
    expect(await screen.findByText(/Hi, Abbie/)).toBeInTheDocument()
    expect(screen.getByText('Log out')).toBeInTheDocument()
    expect(screen.queryByText('Register')).not.toBeInTheDocument()
  })

  it('calls signOut when the log out button is clicked', async () => {
    globalThis.fb.auth.currentUser = { uid: 'u1', email: 'abbie@test.com' }
    renderWithRouter(<Navbar />)
    const logout = await screen.findByText('Log out')
    fireEvent.click(logout)
    await waitFor(() => expect(globalThis.fb.signOut).toHaveBeenCalled())
  })

  it('toggles the mobile menu open and closed', async () => {
    renderWithRouter(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
