import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth' // <-- Notice we use Popup, not Redirect
import { auth, googleProvider } from '../firebase.js'

function GoogleButton() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleGoogle() {
    setError('')
    setLoading(true)

    try {
      // This opens the small Google window
      await signInWithPopup(auth, googleProvider)
      
      // If it works, send them to the homepage or pets page
      navigate('/') 
    } catch (err) {
      // If they close the window or an error happens, show a friendly message
      console.error(err)
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium py-2.5 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Connecting...' : 'Continue with Google'}
      </button>
      
      {/* This shows the red error text if something goes wrong */}
      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default GoogleButton