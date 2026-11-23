import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdoptablePage from '../AdoptablePage.jsx'

vi.mock('../../api/catalog.js', () => ({
  fetchCatalogPets: vi.fn(),
}))
import { fetchCatalogPets } from '../../api/catalog.js'

const DOGS = [
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
]
const CATS = [
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

describe('AdoptablePage', () => {
  afterEach(() => {
    localStorage.clear()
    fetchCatalogPets.mockReset()
  })

  it('loads and shows pets on mount', async () => {
    fetchCatalogPets.mockResolvedValue([...DOGS, ...CATS])
    render(<AdoptablePage />)
    expect(await screen.findByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Luna')).toBeInTheDocument()
  })

  it('shows an error when the fetch fails', async () => {
    fetchCatalogPets.mockRejectedValue(new Error('network'))
    render(<AdoptablePage />)
    expect(await screen.findByText(/Could not load pets/)).toBeInTheDocument()
  })

  it('filters by type when searching', async () => {
    fetchCatalogPets.mockResolvedValueOnce([...DOGS, ...CATS]).mockResolvedValueOnce(CATS)
    render(<AdoptablePage />)
    await screen.findByText('Buddy')
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'cat' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() => expect(fetchCatalogPets).toHaveBeenCalledTimes(2))
    expect(fetchCatalogPets).toHaveBeenLastCalledWith({ type: 'cat', breed: '' })
    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.queryByText('Buddy')).not.toBeInTheDocument()
  })

  it('shows a no-results message when a search returns nothing', async () => {
    fetchCatalogPets.mockResolvedValueOnce([...DOGS, ...CATS]).mockResolvedValueOnce([])
    render(<AdoptablePage />)
    await screen.findByText('Buddy')
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByText(/No pets matched/i)).toBeInTheDocument()
  })

  it('opens the detail modal when a pet is clicked', async () => {
    fetchCatalogPets.mockResolvedValue([...DOGS, ...CATS])
    render(<AdoptablePage />)
    fireEvent.click(await screen.findByRole('button', { name: /Photo of Buddy/ }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Buddy', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Adopt/ })).toHaveAttribute('href', 'https://pf/1')
  })
})
