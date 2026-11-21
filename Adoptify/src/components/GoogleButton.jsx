import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

const ERROR_MESSAGES = {
  'auth/popup-closed-by-user': 'The Google window was closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the popup. Allow popups and try again.',
  'auth/account-exists-with-different-credential':
    'This email already has a password account. Log in with your password instead.',
}

function GoogleButton() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleGoogle() {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate(from)
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? 'Google sign-in failed. Please try again.')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium py-2.5 rounded-lg"
      >
        Continue with Google
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default GoogleButton