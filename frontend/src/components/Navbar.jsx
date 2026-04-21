import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Urban Move
        </Link>

        <div className="hidden md:flex gap-6 items-center font-medium">
          {user ? (
            <>
              <Link to="/search" className="hover:text-accent transition">Search</Link>
              <Link to="/bookings" className="hover:text-accent transition">My Bookings</Link>
              {user.is_admin && (
                <Link to="/admin" className="hover:text-accent transition">Admin</Link>
              )}
              <span className="text-sm border-l pl-4 border-white/20 text-blue-100">{user.name}</span>
              <button onClick={handleLogout} className="bg-accent px-5 py-2 rounded-lg hover:opacity-90 transition font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent transition">Login</Link>
              <Link to="/signup" className="bg-accent px-5 py-2 rounded-lg hover:opacity-90 transition font-semibold">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
             )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary-dark px-4 py-2 space-y-2 pb-4 shadow-inner">
          {user ? (
            <>
              <Link to="/search" className="block hover:text-accent pt-2">Search</Link>
              <Link to="/bookings" className="block hover:text-accent py-2">My Bookings</Link>
              {user.is_admin && (
                <Link to="/admin" className="block hover:text-accent py-2">Admin</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-center bg-accent px-4 py-3 rounded mt-4 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-accent py-2">Login</Link>
              <Link to="/signup" className="block w-full text-center bg-accent px-4 py-3 rounded mt-4 font-semibold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
