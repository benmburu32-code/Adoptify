import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import PetForm from '../components/PetForm.jsx'

function AddPetPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(cleanData) {
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'pets'), {
        ...cleanData,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      })
      navigate('/pets')
    } catch {
      setError('Could not save the pet. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Add a pet for adoption</h1>
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      )}
      <div className="mt-6">
        <PetForm onSubmit={handleSubmit} submitLabel="Add pet" submitting={submitting} />
      </div>
    </div>
  )
}

export default AddPetPage