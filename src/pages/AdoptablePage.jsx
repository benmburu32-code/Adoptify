import { useEffect, useState } from 'react'
import Spinner from '../components/Spinner.jsx'
import PetDetailModal from '../components/PetDetailModal.jsx'
import { useSavedPets } from '../hooks/useSavedPets.js'
import { fetchCatalogPets } from '../api/catalog.js'

const PLACEHOLDER = (name) =>
  `https://placehold.co/600x400/f0fdfa/0f766e?text=${encodeURIComponent(name || 'Pet')}`

function AdoptablePage() {
  const [type, setType] = useState('all')
  const [breed, setBreed] = useState('')
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [selected, setSelected] = useState(null)
  const { isSaved, toggleSave } = useSavedPets()

  // Load every pet once on mount. setState happens only after an await
  // (inside loadInitial), so the effect body has no synchronous state updates.
  useEffect(() => {
    let cancelled = false
    async function loadInitial() {
      try {
        const results = await fetchCatalogPets()
        if (!cancelled) setPets(results)
      } catch {
        if (!cancelled) setError('Could not load pets. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadInitial()
    return () => {
      cancelled = true
    }
  }, [])

  async function runSearch() {
    setLoading(true)
    setError('')
    setHasSearched(true)
    try {
      const results = await fetchCatalogPets({ type, breed: breed.trim() })
      setPets(results)
    } catch {
      setError('Could not load pets. Please try again later.')
      setPets([])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    runSearch()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Adoptable pets</h1>
      <p className="mt-1 text-stone-600">
        Browse our shelter catalog and filter by type or breed. Click any pet for details.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row gap-3 sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="type" className="block text-sm font-medium text-stone-700">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
          >
            <option value="all">All pets</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="breed" className="block text-sm font-medium text-stone-700">Breed (optional)</label>
          <input
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="e.g. Labrador, Tabby"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      )}

      {loading && (
        <div className="mt-12">
          <Spinner />
          <p className="mt-4 text-stone-500 text-center">Fetching pets...</p>
        </div>
      )}

      {!loading && !error && hasSearched && pets.length === 0 && (
        <div className="mt-8 bg-white rounded-xl p-10 text-center text-stone-600">
          No pets matched your search. Try a different type or breed.
        </div>
      )}

      {!loading && pets.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => setSelected(pet)}
              className="text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              <img
                src={pet.photo || PLACEHOLDER(pet.name)}
                alt={`Photo of ${pet.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-stone-800">{pet.name}</h3>
                <p className="text-sm text-stone-500">{pet.breed}</p>
                <p className="text-sm text-stone-500">{pet.age} · {pet.gender}</p>
                {pet.city && <p className="text-sm text-stone-500 mt-1">{pet.city}, {pet.state}</p>}
                {isSaved(pet.id) && <p className="text-xs text-teal-700 mt-1">✓ Saved</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      <PetDetailModal
        pet={selected}
        isSaved={selected ? isSaved(selected.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

export default AdoptablePage
