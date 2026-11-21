import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-teal-700">
          Adoptify 🐾
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/pets"
            className={({ isActive }) =>
              isActive
                ? 'text-teal-700 font-semibold'
                : 'text-stone-600 hover:text-teal-700'
            }
          >
            Browse pets
          </NavLink>
          <Link to="/login" className="text-stone-600 hover:text-teal-700">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar