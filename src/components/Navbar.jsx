import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

// A single place to style the active/inactive nav links keeps things DRY.
const navLinkClass = ({ isActive }) =>
  isActive ? 'text-teal-700 font-semibold' : 'text-stone-600 hover:text-teal-700'

function Navbar() {
  const { user } = useAuth()
  // `open` controls whether the mobile menu is shown. It starts closed.
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut(auth)
    setOpen(false)
  }

  // Close the mobile menu whenever a link is clicked.
  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-teal-700" onClick={closeMenu}>
          Adoptify 🐾
        </Link>

        {/* Desktop navigation — hidden on small screens (md:flex) */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/pets" className={navLinkClass}>Browse pets</NavLink>
          <NavLink to="/discover" className={navLinkClass}>Discover</NavLink>
          <NavLink to="/adoptable" className={navLinkClass}>Adoptable pets</NavLink>
          <NavLink to="/saved" className={navLinkClass}>Saved pets</NavLink>

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

        {/* Hamburger button — only shown on small screens (md:hidden) */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-stone-300 text-stone-700"
        >
          {/* Simple text icon: shows ✕ when open, ☰ when closed */}
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu — slides down below the navbar when `open` is true */}
      {open && (
        <nav className="md:hidden bg-white border-t border-stone-200 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/pets" className={navLinkClass} onClick={closeMenu}>Browse pets</NavLink>
          <NavLink to="/discover" className={navLinkClass} onClick={closeMenu}>Discover</NavLink>
          <NavLink to="/adoptable" className={navLinkClass} onClick={closeMenu}>Adoptable pets</NavLink>
          <NavLink to="/saved" className={navLinkClass} onClick={closeMenu}>Saved pets</NavLink>

          {user && (
            <>
              <NavLink to="/add-pet" className={navLinkClass} onClick={closeMenu}>Add a pet</NavLink>
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>My dashboard</NavLink>
            </>
          )}

          {user ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
              <span className="text-sm text-stone-600">Hi, {user.displayName || user.email}</span>
              <button
                onClick={handleLogout}
                className="text-left text-sm text-stone-600 hover:text-teal-700 underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
              <Link to="/login" className="text-stone-600 hover:text-teal-700" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-center" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
