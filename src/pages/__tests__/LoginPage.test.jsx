import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage.jsx'

function renderLogin() {
  return render(<MemoryRouter><LoginPage /></MemoryRouter>)
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.com' } })
  fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'secret1' } })
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
}

describe('LoginPage', () => {
  it('renders the form and the Google button', () => {
    renderLogin()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continue with Google/ })).toBeInTheDocument()
  })

  it('signs in with email and password', async () => {
    globalThis.fb.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '1' } })
    renderLogin()
    fillAndSubmit()
    await waitFor(() =>
      expect(globalThis.fb.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 'a@b.com', 'secret1'
      )
    )
  })

  it('shows an error on bad credentials', async () => {
    globalThis.fb.signInWithEmailAndPassword.mockRejectedValue(new Error('bad'))
    renderLogin()
    fillAndSubmit()
    expect(await screen.findByText(/Wrong email or password/)).toBeInTheDocument()
  })
})
