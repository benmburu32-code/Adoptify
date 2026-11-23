import { useState } from 'react'
import { Link } from 'react-router-dom'
import PetDetailModal from '../components/PetDetailModal.jsx'
import { useSavedPets } from '../hooks/useSavedPets.js'

const PLACEHOLDER = (name) =>
  `https://placehold.co/600x400/f0fdfa/0f766e?text=${encodeURIComponent(name || 'Pet')}`

function SavedPetsPage() {
  const { saved, isSaved, toggleSave } = useSavedPets()
  const [selected, setSelected] = useState(null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Saved pets</h1>
      <p className="mt-1 text-stone-600">
        {saved.length} pet{saved.length === 1 ? '' : 's'} saved — they stay here even after you
        refresh the page.
      </p>

      {saved.length === 0 ? (
        <div className="mt-8 bg-white rounded-xl p-10 text-center">
          <p className="text-stone-600">You haven&apos;t saved any pets yet.</p>
          <Link
            to="/discover"
            className="mt-3 inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            Discover pets
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((pet) => (
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
                <p className="text-sm text-stone-500">{pet.breed} · {pet.age}</p>
                {pet.city && <p className="text-sm text-stone-500">{pet.city}, {pet.state}</p>}
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

export default SavedPetsPage
