import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import api from "../lib/api"

export default function Bookings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings/mine')
        setBookings(res.data?.data || res.data || [])
      } catch (err) {
        // Mock data setup for phase 1 testing
        setBookings([
          {
            id: "MOCK-1A2B",
            total_price: 700,
            seats: [1, 2],
            status: "confirmed",
            created_at: new Date().toISOString(),
            bus: { name: 'TSRTC Garuda Plus', from_city: 'Hyderabad', to_city: 'Vijayawada', departure_time: '06:00 AM' }
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchBookings()
    }
  }, [user])

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return "bg-green-100 text-green-700 border-green-200"
      case 'pending': return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case 'cancelled': return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div>
      <Navbar />
      <main className="bg-surface min-h-[calc(100vh-72px)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">My Bookings</h1>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {(["all", "confirmed", "pending", "cancelled"]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-full font-semibold capitalize transition whitespace-nowrap border ${
                  filter === status
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-gray-600 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12"><p className="text-gray-500">Loading bookings...</p></div>
          ) : (
             <div className="space-y-5">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Bus</p>
                        <p className="font-bold text-lg text-gray-900">{booking.bus?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Route</p>
                        <p className="font-bold text-lg text-gray-900">
                          {booking.bus?.from_city} → {booking.bus?.to_city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Seats</p>
                        <p className="font-bold text-lg text-gray-900">{booking.seats.join(", ")}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-100 mt-2">
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Departure</p>
                        <p className="font-semibold text-gray-900">{booking.bus?.departure_time}</p>
                        <p className="text-xs text-text-muted">{new Date(booking.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Price</p>
                        <p className="font-bold text-xl text-primary">₹{booking.total_price}</p>
                      </div>
                      <div className="flex flex-col md:items-end justify-between gap-3">
                        <div>
                           <span className={`font-semibold capitalize px-3 py-1 rounded-full text-xs border ${getStatusColor(booking.status)}`}>
                             {booking.status}
                           </span>
                        </div>
                        <button
                          onClick={() => navigate(`/confirmation/${booking.id}`)}
                          className="text-accent font-semibold hover:text-orange-600 transition"
                        >
                          View Ticket →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-dashed border-border text-center">
                  <p className="text-lg text-text-muted mb-6">
                    {filter === "all" ? "You haven't booked any buses yet" : `No ${filter} bookings found`}
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md"
                  >
                    Search Buses
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
