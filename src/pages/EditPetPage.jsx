import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePet } from "../hooks/usePet.js"
import Spinner from '../components/Spinner.jsx'
import PetForm from '../components/PetForm.jsx'

function EditPetPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pet, notFound, loading } = usePet(id)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(cleanData) {
    setSubmitting(true)
    setError('')
    try {
      await updateDoc(doc(db, 'pets', id), cleanData)
      navigate(`/pets/${id}`)
    } catch {
      setError('Could not save changes. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-24"><Spinner /></div>
  }
  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-stone-800">Pet not found</h1>
        <Link to="/dashboard" className="text-teal-700 underline">Back to dashboard</Link>
      </div>
    )
  }
  // Auth might still be resolving on first render. Since this page is normally
  // reached through a ProtectedRoute, `user` will be set shortly — show a
  // spinner until then instead of crashing on `user.uid`.
  if (!user) {
    return <div className="max-w-6xl mx-auto px-4 py-24"><Spinner /></div>
  }
  if (user.uid !== pet.ownerId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-stone-800">Not your listing</h1>
        <p className="mt-2 text-stone-600">You can only edit pets you added.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Edit {pet.name}</h1>
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      )}
      <div className="mt-6">
        <PetForm
          initialValues={{
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            photo: pet.photo || '',
            description: pet.description,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          submitting={submitting}
        />
      </div>
    </div>
  )
}

export default EditPetPage
