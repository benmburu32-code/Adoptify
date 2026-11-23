import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner.jsx'
import PetDetailModal from '../components/PetDetailModal.jsx'
import { useSavedPets } from '../hooks/useSavedPets.js'
import { fetchCatalogPets } from '../api/catalog.js'

const ERROR_MESSAGE = 'Could not load pets. Please try again later.'
const PLACEHOLDER = (name) =>
  `https://placehold.co/600x400/f0fdfa/0f766e?text=${encodeURIComponent(name || 'Pet')}`

function DiscoverPetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const { isSaved, toggleSave } = useSavedPets()

  // Fetch once on mount. Every setState happens AFTER an await (inside load),
  // so there are no synchronous state updates in the effect body.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const results = await fetchCatalogPets()
        if (!cancelled) {
          setPets(results)
          setError('')
        }
      } catch {
        if (!cancelled) setError(ERROR_MESSAGE)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleRefresh() {
    setLoading(true)
    setError('')
    try {
      setPets(await fetchCatalogPets())
    } catch {
      setError(ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-800">Discover New Friends</h1>
        <p className="mt-2 text-stone-600">
          Pets from our shelter catalog — click any pet for details and save it for later.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg"
        >
          Show me more pets 🐾
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 max-w-md mx-auto text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-12">
          <Spinner />
          <p className="mt-4 text-stone-500 text-center">Fetching new friends...</p>
        </div>
      )}

      {!loading && !error && pets.length === 0 && (
        <p className="mt-12 text-center text-stone-500">No pets to show right now. Try refreshing.</p>
      )}

      {!loading && pets.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-stone-800">{pet.name}</h3>
                <p className="text-sm text-stone-500">{pet.breed} · {pet.age}</p>
                {pet.city && <p className="text-sm text-stone-500">{pet.city}, {pet.state}</p>}
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

export default DiscoverPetsPage
