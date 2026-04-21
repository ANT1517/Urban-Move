import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import api from "../lib/api"

export default function Confirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/api/bookings/${id}`)
        setBooking(res.data?.data || res.data)
      } catch (err) {
         // Mock data for phase 1 preview
         setBooking({
            id: id,
            total_price: 700,
            seats: [1, 2],
            status: "confirmed",
            passenger_name: user?.name || "Passenger",
            passenger_phone: user?.phone || "000000000",
            bus: { name: 'TSRTC Garuda Plus', from_city: 'Hyderabad', to_city: 'Vijayawada', departure_time: '06:00 AM', arrival_time: '09:30 AM' }
          })
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id, user])

  if (loading) {
    return <div className="min-h-screen pt-20 text-center"><p>Loading ticket...</p></div>
  }

  if (!booking) {
    return (
       <div className="min-h-screen pt-20 text-center">
          <p>Booking not found.</p>
          <Link to="/search" className="text-primary hover:underline mt-4 inline-block">Go to Search</Link>
       </div>
    )
  }

  const { bus } = booking

  return (
    <div>
      <Navbar />
      <main className="bg-surface min-h-[calc(100vh-72px)] py-12">
        <div className="max-w-2xl mx-auto px-4">
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
             {/* Checkmark Animation setup could go here, for now simple SVG */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-text-muted">Your seats have been successfully reserved.</p>
          </div>

          {/* Ticket Card */}
          <div className="bg-white rounded-xl shadow-md border border-border mb-8 overflow-hidden">
            <div className="bg-primary text-white p-6 flex justify-between items-center">
               <div>
                  <p className="text-xs uppercase tracking-wider text-blue-200 mb-1">Booking Reference</p>
                  <p className="text-xl font-bold font-mono">#{booking.id.split('-').pop().toUpperCase() || booking.id}</p>
               </div>
               <div className="text-right">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm uppercase">
                     {booking.status}
                  </span>
               </div>
            </div>

            <div className="p-6 border-b border-dashed border-gray-300">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <p className="text-xs text-text-muted uppercase mb-1">From</p>
                     <p className="font-bold text-xl text-gray-900">{bus?.from_city}</p>
                     <p className="text-sm font-semibold text-primary">{bus?.departure_time}</p>
                  </div>
                  <div className="flex-1 px-4 flex items-center justify-center">
                     <div className="w-full border-t border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                           </svg>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-text-muted uppercase mb-1">To</p>
                     <p className="font-bold text-xl text-gray-900">{bus?.to_city}</p>
                     <p className="text-sm font-semibold text-primary">{bus?.arrival_time}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-lg border border-border">
                  <div>
                     <p className="text-xs text-text-muted uppercase mb-1">Bus Operator</p>
                     <p className="font-bold text-gray-900">{bus?.name}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-text-muted uppercase mb-1">Seat Numbers</p>
                     <p className="font-bold text-primary text-lg">{booking.seats.join(", ")}</p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-between items-center">
               <div>
                  <p className="text-xs text-text-muted uppercase mb-1">Passenger</p>
                  <p className="font-bold text-gray-900">{booking.passenger_name}</p>
                  <p className="text-sm text-gray-600">{booking.passenger_phone}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-text-muted uppercase mb-1">Total Paid</p>
                  <p className="font-bold text-2xl text-primary">₹{booking.total_price}</p>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
               onClick={() => window.print()}
               className="flex-1 bg-white text-gray-700 border border-border py-4 rounded-xl font-semibold text-center hover:bg-gray-50 shadow-sm transition flex justify-center items-center gap-2"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z" /></svg>
               Download Ticket
            </button>
            <Link
              to="/search"
              className="flex-1 bg-accent text-white py-4 rounded-xl font-semibold text-center hover:bg-orange-600 shadow-md transition"
            >
              Book Another
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
