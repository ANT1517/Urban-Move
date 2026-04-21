import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import api from "../lib/api"

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState("overview")
  const [buses, setBuses] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "", from_city: "", to_city: "", departure_time: "", arrival_time: "", price: "", total_seats: "40"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesRes, bookingsRes] = await Promise.all([
          api.get('/api/buses'),
          api.get('/api/bookings')
        ])
        setBuses(busesRes.data?.data || busesRes.data || [])
        setBookings(bookingsRes.data?.data || bookingsRes.data || [])
      } catch (err) {
      
        setBuses([{ id: '1', name: 'TSRTC Garuda Plus', from_city: 'Hyderabad', to_city: 'Vijayawada', price: 350, total_seats: 40, booked_seats: [1, 2] }])
        setBookings([{ id: 'MOCK-1A2B', total_price: 700, seats: [1, 2], passenger_name: 'John Doe', status: 'confirmed' }])
      } finally {
        setLoading(false)
      }
    }
    
    if (user?.is_admin !== false) { 
       fetchData()
    }
  }, [user])

  const handleAddBus = async (e) => {
    e.preventDefault()
    setIsAdding(true)
    try {
       const newBus = {
          ...formData,
          price: Number(formData.price),
          total_seats: Number(formData.total_seats),
          travel_date: new Date().toISOString().split("T")[0],
          amenities: ["AC", "WiFi"] // default
       }
       const res = await api.post('/api/buses', newBus)
       setBuses([...buses, res.data?.data || res.data || newBus])
       setTab("buses")
       alert("Bus added successfully!")
       setFormData({name: "", from_city: "", to_city: "", departure_time: "", arrival_time: "", price: "", total_seats: "40"})
    } catch (err) {
       alert("Failed to add bus (mock phase fallback used)")
       const mockAdded = {id: Math.random().toString(), ...formData, price: Number(formData.price), total_seats: Number(formData.total_seats), booked_seats: []}
       setBuses([...buses, mockAdded])
       setTab("buses")
    } finally {
       setIsAdding(false)
    }
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_price), 0)
  const totalBookings = bookings.length
  const totalSeatsBooked = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0)

  if (loading) return <div><Navbar /><div className="p-8 text-center">Loading dashboard...</div></div>

  return (
    <div>
      <Navbar />
      <main className="bg-surface min-h-[calc(100vh-72px)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">Admin Auto-Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-border">
            {(["overview", "buses", "add-bus"]).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                className={`px-6 py-3 font-semibold capitalize transition-all border-b-2 flex-1 md:flex-none ${
                  tab === tabName
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-text-muted hover:text-primary hover:bg-gray-50"
                }`}
              >
                {tabName.replace("-", " ")}
              </button>
            ))}
          </div>

          
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <p className="text-sm text-text-muted uppercase tracking-wider mb-2 font-semibold">Total Revenue</p>
                  <p className="text-4xl font-bold text-green-600">₹{totalRevenue}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <p className="text-sm text-text-muted uppercase tracking-wider mb-2 font-semibold">Total Bookings</p>
                  <p className="text-4xl font-bold text-primary">{totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                  <p className="text-sm text-text-muted uppercase tracking-wider mb-2 font-semibold">Seats Booked</p>
                  <p className="text-4xl font-bold text-accent">{totalSeatsBooked}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-border text-xs uppercase text-gray-600">
                      <tr>
                        <th className="py-3 px-4 rounded-tl-lg">ID</th>
                        <th className="py-3 px-4">Passenger</th>
                        <th className="py-3 px-4">Seats</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 rounded-tr-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(-10).map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">{booking.id.split('-').pop()}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{booking.passenger_name}</td>
                          <td className="py-3 px-4">{booking.seats.join(", ")}</td>
                          <td className="py-3 px-4 font-semibold text-primary">₹{booking.total_price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                         <tr><td colSpan="5" className="py-8 text-center text-gray-500">No bookings yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === "buses" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-900">Manage Buses</h2>
                 <button onClick={() => setTab('add-bus')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Add New</button>
              </div>
              
              {buses.map((bus) => (
                <div key={bus.id} className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Bus Operator</p>
                      <p className="font-bold text-gray-900">{bus.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Route</p>
                      <p className="font-bold text-gray-900">
                        {bus.from_city} → {bus.to_city}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Price</p>
                      <p className="font-bold text-primary">₹{bus.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Occupancy</p>
                      <p className="font-bold text-gray-900">
                        {bus.booked_seats?.length || 0}/{bus.total_seats}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t pt-4 md:border-t-0 md:pt-0">
                    <button className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition text-sm">Edit</button>
                  </div>
                </div>
              ))}
              {buses.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">No buses running</div>
              )}
            </div>
          )}


          {tab === "add-bus" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-border max-w-3xl">
              <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900">Add New Bus Route</h2>
              <form onSubmit={handleAddBus} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Bus Operator Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required placeholder="e.g. Shivneri Travels" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">From City</label>
                    <input type="text" value={formData.from_city} onChange={(e) => setFormData({ ...formData, from_city: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">To City</label>
                    <input type="text" value={formData.to_city} onChange={(e) => setFormData({ ...formData, to_city: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Departure Time</label>
                    <input type="time" value={formData.departure_time} onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Arrival Time</label>
                    <input type="time" value={formData.arrival_time} onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Price per Seat (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Total Seats</label>
                    <input type="number" value={formData.total_seats} onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button type="button" onClick={() => setTab('buses')} className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
                   <button type="submit" disabled={isAdding} className="flex-[2] bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition shadow-md disabled:bg-gray-400">
                     {isAdding ? "Adding..." : "Publish Bus Route"}
                   </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
