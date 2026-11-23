import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DiscoverPetsPage from '../DiscoverPetsPage.jsx'

vi.mock('../../api/catalog.js', () => ({
  fetchCatalogPets: vi.fn(),
}))
import { fetchCatalogPets } from '../../api/catalog.js'

const PETS = [
  {
    id: 'dog-1',
    name: 'Buddy',
    photo: '/d1.jpg',
    breed: 'Labrador Retriever',
    age: 'Young',
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    description: 'Good boy',
    url: 'https://pf/1',
  },
  {
    id: 'cat-1',
    name: 'Luna',
    photo: '/c1.jpg',
    breed: 'Tabby',
    age: 'Adult',
    gender: 'Female',
    city: 'Boston',
    state: 'MA',
    description: 'Sweet girl',
    url: 'https://pf/2',
  },
]

describe('DiscoverPetsPage', () => {
  afterEach(() => {
    localStorage.clear()
    fetchCatalogPets.mockReset()
  })

  it('fetches and displays pets', async () => {
    fetchCatalogPets.mockResolvedValue(PETS)
    render(<DiscoverPetsPage />)
    expect(await screen.findByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Luna')).toBeInTheDocument()
  })

  it('shows an error when the fetch fetch fails', async () => {
    fetchCatalogPets.mockRejectedValue(new Error('network'))
    render(<DiscoverPetsPage />)
    expect(await screen.findByText(/Could not load pets/)).toBeInTheDocument()
  })

  it('refetches when "Show me more pets" is clicked', async () => {
    fetchCatalogPets.mockResolvedValue(PETS)
    render(<DiscoverPetsPage />)
    await screen.findByText('Buddy')
    fireEvent.click(screen.getByRole('button', { name: /Show me more pets/ }))
    await waitFor(() => expect(fetchCatalogPets).toHaveBeenCalledTimes(2))
  })

  it('opens the detail modal when a pet card is clicked', async () => {
    fetchCatalogPets.mockResolvedValue(PETS)
    render(<DiscoverPetsPage />)
    fireEvent.click(await screen.findByRole('button', { name: /Photo of Buddy/ }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Buddy', level: 2 })).toBeInTheDocument()
    expect(screen.getAllByText(/New York, NY/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Adopt/ })).toHaveAttribute('href', 'https://pf/1')
  })

  it('saves a pet from the modal and marks it on the card', async () => {
    fetchCatalogPets.mockResolvedValue(PETS)
    render(<DiscoverPetsPage />)
    fireEvent.click(await screen.findByRole('button', { name: /Photo of Buddy/ }))
    fireEvent.click(await screen.findByRole('button', { name: /Save for later/ }))
    expect(await screen.findByText('✓ Saved')).toBeInTheDocument()
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('adoptify:savedPets'))).toHaveLength(1)
    )
  })
})
