import { Link } from 'react-router-dom'
import PetCard from '../components/PetCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { usePets } from '../hooks/usePets.js'

function PetsPage() {
  const { pets, loading, error } = usePets()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">All pets</h1>
      <p className="mt-1 text-stone-600">
        {pets.length} friends are waiting for a home.
      </p>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {loading && (
        <div className="mt-12">
          <Spinner />
        </div>
      )}

      {!loading && !error && pets.length === 0 && (
        <div className="mt-8 bg-white rounded-xl p-10 text-center">
          <p className="text-stone-600">No pets yet — be the first to list one!</p>
          <Link
            to="/add-pet"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            Add a pet
          </Link>
        </div>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PetsPage