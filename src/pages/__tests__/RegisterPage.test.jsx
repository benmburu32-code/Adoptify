import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../RegisterPage.jsx'

function renderRegister() {
  return render(<MemoryRouter><RegisterPage /></MemoryRouter>)
}

function fillForm(password = 'secret1') {
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Abbie' } })
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.com' } })
  fireEvent.change(screen.getByLabelText(/Password/), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
}

describe('RegisterPage', () => {
  it('rejects a short password before calling Firebase', () => {
    renderRegister()
    fillForm('123')
    expect(screen.getByText(/Password must be at least 6 characters/)).toBeInTheDocument()
    expect(globalThis.fb.createUserWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('creates an account and shows a success message', async () => {
    globalThis.fb.createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '1' } })
    globalThis.fb.updateProfile.mockResolvedValue(undefined)
    renderRegister()
    fillForm()
    expect(await screen.findByText(/Account created/)).toBeInTheDocument()
    expect(globalThis.fb.createUserWithEmailAndPassword).toHaveBeenCalled()
  })

  it('maps a Firebase error code to a friendly message', async () => {
    globalThis.fb.createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' })
    renderRegister()
    fillForm()
    expect(await screen.findByText(/already has an account/)).toBeInTheDocument()
  })
})
