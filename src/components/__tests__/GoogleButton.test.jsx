import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GoogleButton from '../GoogleButton.jsx'

function renderIt() {
  return render(<MemoryRouter><GoogleButton /></MemoryRouter>)
}

describe('GoogleButton', () => {
  it('calls signInWithPopup on click', async () => {
    globalThis.fb.signInWithPopup.mockResolvedValue({})
    renderIt()
    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/ }))
    await waitFor(() => expect(globalThis.fb.signInWithPopup).toHaveBeenCalled())
  })

  it('shows an error message when sign-in fails', async () => {
    globalThis.fb.signInWithPopup.mockRejectedValue(new Error('popup closed'))
    renderIt()
    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/ }))
    expect(await screen.findByText(/Google sign-in failed/)).toBeInTheDocument()
  })
})
