import { Link, NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-teal-700 font-semibold' : 'text-stone-600 hover:text-teal-700'

function Navbar() {
  const { user } = useAuth()

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-teal-700">Adoptify 🐾</Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/pets" className={navLinkClass}>Browse pets</NavLink>

          {user && (
            <>
              <NavLink to="/add-pet" className={navLinkClass}>Add a pet</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>My dashboard</NavLink>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-600">Hi, {user.displayName || user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-600 hover:text-teal-700 underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-stone-600 hover:text-teal-700">Log in</Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar