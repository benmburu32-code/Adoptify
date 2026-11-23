import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import AddPetPage from '../AddPetPage.jsx'

function renderAdd() {
  globalThis.fb.auth.currentUser = { uid: 'owner-1', email: 'o@test.com' }
  return render(
    <MemoryRouter><AuthProvider><AddPetPage /></AuthProvider></MemoryRouter>
  )
}

function fillForm() {
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Rocky' } })
  fireEvent.change(screen.getByLabelText(/Breed/), { target: { value: 'Shepherd' } })
  fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '3' } })
  fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Loyal' } })
}

describe('AddPetPage', () => {
  it('saves a pet to Firestore with the owner id', async () => {
    globalThis.fb.addDoc.mockResolvedValue({ id: 'new1' })
    renderAdd()
    // Wait for the page (and the auth listener) to settle before interacting,
    // so `user` is populated when the form is submitted.
    await screen.findByRole('heading', { name: /Add a pet for adoption/i })
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Add pet' }))
    await waitFor(() => expect(globalThis.fb.addDoc).toHaveBeenCalled())
    const saved = globalThis.fb.addDoc.mock.calls[0][1]
    expect(saved).toMatchObject({ name: 'Rocky', breed: 'Shepherd', age: 3, ownerId: 'owner-1' })
  })

  it('shows an error when saving fails', async () => {
    globalThis.fb.addDoc.mockRejectedValue(new Error('nope'))
    renderAdd()
    await screen.findByRole('heading', { name: /Add a pet for adoption/i })
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Add pet' }))
    expect(await screen.findByText(/Could not save the pet/)).toBeInTheDocument()
  })
})
