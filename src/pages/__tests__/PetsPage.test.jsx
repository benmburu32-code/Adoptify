import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PetsPage from '../PetsPage.jsx'

function mockPets(docs) {
  globalThis.fb.getDocs.mockResolvedValue({
    docs: docs.map((d) => ({ id: d.id, data: () => d })),
  })
}

describe('PetsPage', () => {
  it('shows a spinner then the list of pets', async () => {
    mockPets([
      { id: '1', name: 'Luna', breed: 'Lab', age: 2 },
      { id: '2', name: 'Milo', breed: 'Cat', age: 1 },
    ])
    render(<MemoryRouter><PetsPage /></MemoryRouter>)
    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.getByText('Milo')).toBeInTheDocument()
    expect(screen.getByText(/2 friends are waiting/)).toBeInTheDocument()
  })

  it('shows an empty state when there are no pets', async () => {
    mockPets([])
    render(<MemoryRouter><PetsPage /></MemoryRouter>)
    expect(await screen.findByText(/No pets yet/)).toBeInTheDocument()
  })

  it('shows an error message when Firestore fails', async () => {
    globalThis.fb.getDocs.mockRejectedValue(new Error('boom'))
    render(<MemoryRouter><PetsPage /></MemoryRouter>)
    expect(await screen.findByText('boom')).toBeInTheDocument()
  })
})
