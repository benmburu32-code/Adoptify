import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePet } from '../hooks/usePet.js'
import Spinner from '../components/Spinner.jsx'

function PetDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pet, notFound, loading } = usePet(id)
  
  // This checks if the logged-in user is the one who created the pet
  const isOwner = Boolean(user && pet && user.uid === pet.ownerId)

  async function handleDelete() {
    const confirmed = window.confirm(`Really remove ${pet.name} from Adoptify?`)
    if (!confirmed) return
    await deleteDoc(doc(db, 'pets', id))
    navigate('/pets')
  }

  // 1. Show loading spinner
  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-24"><Spinner /></div>
  }

  // 2. Show error if the pet doesn't exist in the database
  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-stone-800">Pet not found</h1>
        <p className="mt-2 text-stone-600">
          It may have already found a home.{' '}
          <Link to="/pets" className="text-teal-700 underline">See who's still waiting</Link>
        </p>
      </div>
    )
  }

  // 3. Show the actual pet details
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/pets" className="text-sm text-teal-700 underline">← Back to all pets</Link>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Image */}
        <img
          src={pet.photo || `https://placehold.co/800x600/f0fdfa/0f766e?text=${pet.name || 'Pet'}`}
          alt={`Photo of ${pet.name}`}
          className="w-full rounded-2xl object-cover max-h-[480px]"
        />
        
        {/* Right Side: Details */}
        <div>
          <h1 className="text-4xl font-bold text-stone-800">{pet.name || 'Unknown Name'}</h1>
          <p className="mt-2 text-stone-500">
            {pet.breed || 'Unknown Breed'} · {pet.age || '?'} {pet.age === 1 ? 'year' : 'years'} old
          </p>
          
          <p className="mt-6 text-stone-700 leading-relaxed">
            {pet.description || 'No description provided for this pet yet.'}
          </p>

          {/* Buttons Logic */}
          {isOwner ? (
            <div className="mt-8 flex gap-3">
              <Link
                to={`/pets/${pet.id}/edit`}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg"
              >
                Edit listing
              </Link>
              <button
                onClick={handleDelete}
                className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-6 py-2.5 rounded-lg"
              >
                Delete
              </button>
            </div>
          ) : user ? (
            <div className="mt-8">
              <p className="text-sm text-stone-500">Adoption applications coming soon.</p>
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: { pathname: `/pets/${pet.id}` } }}
              className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg"
            >
              Log in to apply for adoption
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default PetDetailPage