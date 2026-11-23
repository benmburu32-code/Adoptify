import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import PetDetailPage from '../PetDetailPage.jsx'

const PET = { name: 'Luna', breed: 'Labrador', age: 2, photo: '', description: 'Nice dog', ownerId: 'owner-1' }

// Build a fake Firestore document snapshot.
function petDoc(exists = true, data = PET) {
  return { exists: () => exists, id: '1', data: () => data }
}

function renderPage(routeId = '1', user, getDocImpl) {
  // Configure the Firebase fakes INSIDE the test (after the shared
  // setupTests reset), not in a file-level beforeEach — otherwise the reset
  // wipes them.
  if (user) globalThis.fb.auth.currentUser = user
  if (getDocImpl) globalThis.fb.getDoc.mockImplementation(getDocImpl)
  return render(
    <MemoryRouter initialEntries={[`/pets/${routeId}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/pets/:id" element={<PetDetailPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('PetDetailPage', () => {
  it('shows a spinner while loading', () => {
    // never-resolving getDoc → loading stays true
    renderPage('1', null, () => new Promise(() => {}))
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByText('Luna')).not.toBeInTheDocument()
  })

  it('shows the not-found UI when the pet does not exist', async () => {
    renderPage('missing', null, async () => petDoc(false))
    expect(await screen.findByText(/Pet not found/)).toBeInTheDocument()
  })

  it('shows a login prompt when no user is signed in', async () => {
    renderPage('1', null, async () => petDoc(true))
    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.getByText(/Log in to apply for adoption/)).toBeInTheDocument()
  })

  it('shows owner edit/delete buttons for the owner', async () => {
    renderPage('1', { uid: 'owner-1', email: 'o@test.com' }, async () => petDoc(true))
    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.getByText('Edit listing')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('deletes the pet after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage('1', { uid: 'owner-1', email: 'o@test.com' }, async () => petDoc(true))
    await screen.findByText('Luna')
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => expect(globalThis.fb.deleteDoc).toHaveBeenCalled())
  })

  it('shows the coming-soon message for a logged-in non-owner', async () => {
    renderPage('1', { uid: 'someone-else', email: 'x@test.com' }, async () => petDoc(true))
    expect(await screen.findByText(/Adoption applications coming soon/)).toBeInTheDocument()
  })
})
