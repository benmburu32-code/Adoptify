import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import GoogleButton from '../components/GoogleButton.jsx' // <-- 1. THIS IS THE IMPORT

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/pets')
    } catch {
      setError('Wrong email or password. Try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Welcome back</h1>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
          <input 
            id="email" 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" 
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
          <input 
            id="password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" 
          />
        </div>
        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg">
          Log in
        </button>
      </form>

      {/* 2. THIS IS WHERE THE GOOGLE BUTTON LIVES */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute border-t border-stone-300 w-full"></div>
          <span className="relative bg-stone-100 px-4 text-sm text-stone-500">Or</span>
        </div>
        <GoogleButton />
      </div>

      <p className="mt-6 text-sm text-stone-600 text-center">
        New here? <Link to="/register" className="text-teal-700 font-medium underline">Create an account</Link>
      </p>
    </div>
  )
}

export default LoginPage