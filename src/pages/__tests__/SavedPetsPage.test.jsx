import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SavedPetsPage from '../SavedPetsPage.jsx'

const PETS = [
  {
    id: 1,
    name: 'Buddy',
    photo: 'b.jpg',
    breed: 'Labrador',
    age: 'Young',
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    description: 'Good boy',
    url: 'https://pf/1',
  },
]

function renderPage() {
  return render(<MemoryRouter><SavedPetsPage /></MemoryRouter>)
}

describe('SavedPetsPage', () => {
  beforeEach(() => localStorage.clear())

  it('shows an empty state with a link to /discover', () => {
    renderPage()
    expect(screen.getByText(/haven't saved any pets yet/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Discover pets' })).toHaveAttribute('href', '/discover')
  })

  it('lists pets that were saved in localStorage', () => {
    localStorage.setItem('adoptify:savedPets', JSON.stringify(PETS))
    renderPage()
    expect(screen.getByRole('heading', { name: 'Buddy' })).toBeInTheDocument()
    expect(screen.getByText(/New York, NY/)).toBeInTheDocument()
  })

  it('opens the modal and removes a pet when the remove button is clicked', async () => {
    localStorage.setItem('adoptify:savedPets', JSON.stringify(PETS))
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Photo of Buddy/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /click to remove/ }))
    // persisted removal
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('adoptify:savedPets'))).toEqual([])
    )
    // close the modal -> the empty state is now visible behind it
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(await screen.findByText(/haven't saved any pets yet/)).toBeInTheDocument()
  })
})
