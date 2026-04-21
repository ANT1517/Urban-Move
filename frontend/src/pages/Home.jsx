import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-primary to-primary-dark text-white flex flex-col pt-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Urban Move
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl font-light">
            Intercity public bus booking — fast, safe, affordable and reliable journeys across India.
          </p>

          {user ? (
            <div className="flex flex-wrap gap-4">
              <Link
                to="/search"
                className="bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 inline-block shadow-lg text-lg"
              >
                Search Buses
              </Link>
              <Link
                to="/bookings"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 inline-block shadow-lg text-lg"
              >
                My Bookings
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link
                to="/search"
                className="bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 inline-block shadow-lg text-lg"
              >
                Search Buses Now
              </Link>
              <Link
                to="/signup"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 inline-block shadow-lg text-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
