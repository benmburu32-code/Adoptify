import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import EditPetPage from '../EditPetPage.jsx'

const PET = { name: 'Luna', breed: 'Labrador', age: 2, photo: '', description: 'Nice', ownerId: 'owner-1' }

function renderEdit(routeId = '1', user, exists = true) {
  // Configure fakes inline (see PetDetailPage.test.jsx for the why), and mount
  // the page inside a real <Route> so useParams() returns the id.
  if (user) globalThis.fb.auth.currentUser = user
  globalThis.fb.getDoc.mockResolvedValue({ exists: () => exists, id: '1', data: () => PET })
  return render(
    <MemoryRouter initialEntries={[`/pets/${routeId}/edit`]}>
      <AuthProvider>
        <Routes>
          <Route path="/pets/:id/edit" element={<EditPetPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('EditPetPage', () => {
  it('shows not-found when the pet does not exist', async () => {
    renderEdit('1', { uid: 'owner-1', email: 'o@test.com' }, false)
    expect(await screen.findByText(/Pet not found/)).toBeInTheDocument()
  })

  it('blocks editing for non-owners', async () => {
    renderEdit('1', { uid: 'other', email: 'x@test.com' }, true)
    expect(await screen.findByText(/Not your listing/)).toBeInTheDocument()
  })

  it('updates the pet when the owner submits the form', async () => {
    globalThis.fb.updateDoc.mockResolvedValue(undefined)
    renderEdit('1', { uid: 'owner-1', email: 'o@test.com' }, true)
    expect(await screen.findByDisplayValue('Luna')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Breed/), { target: { value: 'Labrador Mix' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(globalThis.fb.updateDoc).toHaveBeenCalled())
  })
})
