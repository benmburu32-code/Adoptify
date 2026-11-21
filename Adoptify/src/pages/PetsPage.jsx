import PetCard from '../components/PetCard.jsx'
import { pets } from '../data/pets.js'

function PetsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">All pets</h1>
      <p className="mt-1 text-stone-600">{pets.length} friends are waiting for a home.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}

export default PetsPage