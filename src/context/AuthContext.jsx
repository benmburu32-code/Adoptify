import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { auth } from '../firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Force Firebase to use local persistence (survives refresh, works on localhost)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
        return () => unsubscribe()
      })
      .catch((err) => {
        console.error('[AuthContext] setPersistence failed:', err)
        setLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}