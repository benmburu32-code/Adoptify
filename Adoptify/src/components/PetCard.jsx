import { Link } from 'react-router-dom'

function PetCard({ pet }) {
  return (
    <Link
      to={`/pets/${pet.id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <img src={pet.photo} alt={`Photo of ${pet.name}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-800">{pet.name}</h3>
        <p className="text-sm text-stone-500">
          {pet.breed} · {pet.age} {pet.age === 1 ? 'year' : 'years'} old
        </p>
      </div>
    </Link>
  )
}

export default PetCard