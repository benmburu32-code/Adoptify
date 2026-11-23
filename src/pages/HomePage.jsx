import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import PetDetailModal from '../components/PetDetailModal.jsx'
import { useSavedPets } from '../hooks/useSavedPets.js'
import { getFeaturedPets } from '../api/catalog.js'

const PLACEHOLDER = (name) =>
  `https://placehold.co/600x400/f0fdfa/0f766e?text=${encodeURIComponent(name || 'Pet')}`

function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const { isSaved, toggleSave } = useSavedPets()

  // Fetch the featured pets once on mount. Every setState happens AFTER an
  // await (inside load), so there are no synchronous state updates in the
  // effect body.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const pets = await getFeaturedPets(3)
        if (!cancelled) setFeatured(pets)
      } catch {
        // Featured pets are best-effort; leave the grid empty if this fails.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <section className="bg-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Find your new best friend</h1>
          <p className="mt-4 text-lg text-teal-100">Every pet deserves a home. Every home deserves a pet.</p>
          <Link
            to="/discover"
            className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Meet our pets
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-800">Featured friends</h2>
        <p className="mt-1 text-stone-600">Click any pet to read their story, adopt, or save them for later.</p>

        {loading && (
          <div className="mt-8">
            <Spinner />
          </div>
        )}

        {!loading && featured.length === 0 && (
          <p className="mt-8 text-stone-500">No featured pets to show right now.</p>
        )}

        {!loading && featured.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelected(pet)}
                className="text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <img
                  src={pet.photo || PLACEHOLDER(pet.name)}
                  alt={`Photo of ${pet.name}`}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-stone-800">{pet.name}</h3>
                  <p className="text-sm text-stone-500">{pet.breed} · {pet.age}</p>
                  <p className="text-sm text-stone-500">{pet.city}, {pet.state}</p>
                  {isSaved(pet.id) && <p className="text-xs text-teal-700 mt-1">✓ Saved</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <PetDetailModal
        pet={selected}
        isSaved={selected ? isSaved(selected.id) : false}
        onToggleSave={toggleSave}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

export default HomePage
