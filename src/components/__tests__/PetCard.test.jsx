import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PetCard from '../PetCard.jsx'

describe('PetCard', () => {
  const pet = {
    id: 'abc',
    name: 'Luna',
    breed: 'Labrador',
    age: 2,
    photo: 'https://example.com/luna.jpg',
    description: 'Lovely dog',
  }

  it('links to the pet detail page and shows name, breed and age', () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <PetCard pet={pet} />
      </MemoryRouter>
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', '/pets/abc')
    expect(getByText('Luna')).toBeInTheDocument()
    expect(getByText(/Labrador/)).toBeInTheDocument()
    expect(getByText(/2 years old/)).toBeInTheDocument()
  })

  it('uses a placeholder image when no photo is provided', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <PetCard pet={{ ...pet, photo: '' }} />
      </MemoryRouter>
    )
    const img = getByRole('img')
    expect(img.getAttribute('src')).toContain('placehold.co')
  })

  it('says "year" (singular) when age is 1', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PetCard pet={{ ...pet, age: 1 }} />
      </MemoryRouter>
    )
    expect(getByText(/1 year old/)).toBeInTheDocument()
  })
})
