import { Link } from 'react-router-dom'
import PetCard from '../components/PetCard.jsx'
import { pets } from '../data/pets.js'

function HomePage() {
  const featuredPets = pets.slice(0, 3)

  return (
    <div>
      <section className="bg-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Find your new best friend</h1>
          <p className="mt-4 text-lg text-teal-100">Every pet deserves a home. Every home deserves a pet.</p>
          <Link
            to="/pets"
            className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg"
          >
            Browse pets
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-stone-800">Featured friends</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage