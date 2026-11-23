import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import DashboardPage from '../DashboardPage.jsx'

function mockPets(docs) {
  globalThis.fb.getDocs.mockResolvedValue({
    docs: docs.map((d) => ({ id: d.id, data: () => d })),
  })
}

function renderDash(user) {
  globalThis.fb.auth.currentUser = user
  return render(
    <MemoryRouter><AuthProvider><DashboardPage /></AuthProvider></MemoryRouter>
  )
}

describe('DashboardPage', () => {
  it('shows only the listings owned by the current user', async () => {
    mockPets([
      { id: '1', name: 'Luna', breed: 'Lab', age: 2, ownerId: 'me' },
      { id: '2', name: 'Milo', breed: 'Cat', age: 1, ownerId: 'someone-else' },
    ])
    renderDash({ uid: 'me', email: 'me@test.com' })
    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.queryByText('Milo')).not.toBeInTheDocument()
  })

  it('shows an empty state when the user has no listings', async () => {
    mockPets([{ id: '1', name: 'Luna', breed: 'Lab', age: 2, ownerId: 'someone-else' }])
    renderDash({ uid: 'me', email: 'me@test.com' })
    expect(await screen.findByText(/haven't listed any pets/)).toBeInTheDocument()
  })
})
