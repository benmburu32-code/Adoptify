import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePets } from '../hooks/usePets.js'
import PetCard from '../components/PetCard.jsx'
import Spinner from '../components/Spinner.jsx'

function DashboardPage() {
  const { user } = useAuth()
  const { pets, loading } = usePets()
 
  const myPets = pets.filter((pet) => pet.ownerId === user.uid)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">My dashboard</h1>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-stone-800">My listings</h2>
        {loading && <div className="mt-6"><Spinner /></div>}
        {!loading && myPets.length === 0 && (
          <div className="mt-4 bg-white rounded-xl p-10 text-center">
            <p className="text-stone-600">You haven't listed any pets yet.</p>
            <Link to="/add-pet" className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg">
              Add a pet
            </Link>
          </div>
        )}
        {myPets.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-800">My applications</h2>
        <div className="mt-4 bg-white rounded-xl p-10 text-center text-stone-600">
          No applications yet — browse the pets and find your match. 🐾
        </div>
      </section>
    </div>
  )
}

export default DashboardPage