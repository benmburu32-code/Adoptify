import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase.js'

const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'That email already has an account. Try logging in instead.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': "That email address doesn't look right.",
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase yet.',
}

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credentials.user, { displayName: name })
      setSuccess(true)
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Create your account</h1>

      {success && (
        <div className="mt-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg p-4">
          Account created — welcome to Adoptify! 🎉
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">Name</label>
          <input
            id="name" type="text" required
            value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
          <input
            id="email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
          <input
            id="password" type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-stone-600">
        Already have an account? <Link to="/login" className="text-teal-700 font-medium underline">Log in</Link>
      </p>
    </div>
  )
}

export default RegisterPage