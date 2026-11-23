import db from '../data/db.json'

// A small artificial delay so loading spinners are visible and the data flow
// feels like a real API call. The data itself is read synchronously from the
// bundled db.json, so there is no network dependency and no API key needed.
const DELAY = 250
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Curated mix shown on the home page: a lab, a cat, a husky (and a spare).
const FEATURED_IDS = ['dog-1', 'cat-1', 'dog-6', 'dog-10']

/**
 * Fetch pets from the local catalog, optionally filtered.
 * @param {{ type?: string, breed?: string }} opts
 *   type  - "dog" | "cat" | "all" (default: all)
 *   breed - case-insensitive substring to match against the breed field
 */
export async function fetchCatalogPets({ type, breed } = {}) {
  await delay(DELAY)
  const t = (type || '').trim().toLowerCase()
  const b = (breed || '').trim().toLowerCase()
  return db.filter((pet) => {
    if (t && t !== 'all' && pet.type !== t) return false
    if (b && !pet.breed.toLowerCase().includes(b)) return false
    return true
  })
}

/** Fetch a single pet by id (string compare, so "dog-1" and "cat-2" are safe). */
export async function getCatalogPetById(id) {
  await delay(DELAY)
  return db.find((pet) => String(pet.id) === String(id)) || null
}

/** Fetch the curated featured pets for the home page. */
export async function getFeaturedPets(n = 3) {
  await delay(DELAY)
  return FEATURED_IDS.slice(0, n)
    .map((id) => db.find((pet) => pet.id === id))
    .filter(Boolean)
}

// The raw array, exported for tests and any synchronous caller.
export const ALL_CATALOG_PETS = db
