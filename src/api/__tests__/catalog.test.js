import { describe, it, expect } from 'vitest'
import {
  fetchCatalogPets,
  getCatalogPetById,
  getFeaturedPets,
  ALL_CATALOG_PETS,
} from '../catalog.js'

describe('catalog', () => {
  it('returns every pet when no filter is given', async () => {
    const pets = await fetchCatalogPets()
    expect(pets.length).toBe(ALL_CATALOG_PETS.length)
    expect(pets.length).toBeGreaterThanOrEqual(12)
  })

  it('filters by type', async () => {
    const dogs = await fetchCatalogPets({ type: 'dog' })
    const cats = await fetchCatalogPets({ type: 'cat' })
    expect(dogs.every((p) => p.type === 'dog')).toBe(true)
    expect(cats.every((p) => p.type === 'cat')).toBe(true)
    expect(dogs.length + cats.length).toBe(ALL_CATALOG_PETS.length)
  })

  it('treats type "all" as no filter', async () => {
    const all = await fetchCatalogPets({ type: 'all' })
    expect(all.length).toBe(ALL_CATALOG_PETS.length)
  })

  it('filters by breed as a case-insensitive substring', async () => {
    const results = await fetchCatalogPets({ breed: 'retriever' })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((p) => p.breed.toLowerCase().includes('retriever'))).toBe(true)
  })

  it('finds a pet by id', async () => {
    const pet = await getCatalogPetById('dog-1')
    expect(pet).not.toBeNull()
    expect(pet.id).toBe('dog-1')
    expect(pet.photo).toBe('/images/pets/dog-1.jpg')
  })

  it('returns null for an unknown id', async () => {
    const pet = await getCatalogPetById('nope')
    expect(pet).toBeNull()
  })

  it('returns a mix of dogs and cats for featured', async () => {
    const featured = await getFeaturedPets(3)
    expect(featured).toHaveLength(3)
    const types = featured.map((p) => p.type)
    expect(types).toContain('dog')
    expect(types).toContain('cat')
  })
})
