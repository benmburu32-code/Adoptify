import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../HomePage.jsx'

vi.mock('../../api/catalog.js', () => ({
  getFeaturedPets: vi.fn(),
}))
import { getFeaturedPets } from '../../api/catalog.js'

const FEATURED = [
  {
    id: 'dog-1',
    name: 'Max',
    photo: '/images/pets/dog-1.jpg',
    breed: 'Labrador Retriever',
    age: 'Young',
    gender: 'Male',
    city: 'Austin',
    state: 'TX',
    description: 'Good boy',
    url: 'https://pf/1',
  },
  {
    id: 'cat-1',
    name: 'Milo',
    photo: '/images/pets/cat-1.jpg',
    breed: 'Domestic Shorthair',
    age: 'Young',
    gender: 'Male',
    city: 'Austin',
    state: 'TX',
    description: 'Sweet cat',
    url: 'https://pf/2',
  },
]

describe('HomePage', () => {
  afterEach(() => {
    localStorage.clear()
    getFeaturedPets.mockReset()
  })

  it('renders the hero and featured pets', async () => {
    getFeaturedPets.mockResolvedValue(FEATURED)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Find your new best friend')).toBeInTheDocument()
    expect(screen.getByText('Featured friends')).toBeInTheDocument()
    expect(await screen.findByText('Max')).toBeInTheDocument()
    expect(screen.getByText('Milo')).toBeInTheDocument()
  })

  it('links to the discover page from the hero', async () => {
    getFeaturedPets.mockResolvedValue(FEATURED)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    await screen.findByText('Max') // flush the async featured load
    expect(screen.getByRole('link', { name: 'Meet our pets' })).toHaveAttribute('href', '/discover')
  })

  it('opens the detail modal when a featured pet is clicked', async () => {
    getFeaturedPets.mockResolvedValue(FEATURED)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    fireEvent.click(await screen.findByRole('button', { name: /Photo of Max/ }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Max', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Adopt/ })).toHaveAttribute('href', 'https://pf/1')
  })
})
