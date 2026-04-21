import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import BusCard from "../components/BusCard"
import api from "../lib/api"

export default function Search() {
  const [buses, setBuses] = useState([])
  const [filteredBuses, setFilteredBuses] = useState([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/buses')
      setBuses(res.data?.data || res.data || [])
      setFilteredBuses(res.data?.data || res.data || [])
    } catch (err) {
      setError("Failed to fetch buses. Backend might be offline. Showing mock data.")
      const mockBuses = [
        { id: '1', name: 'TSRTC Garuda Plus', from_city: 'Hyderabad', to_city: 'Vijayawada', departure_time: '06:00 AM', arrival_time: '09:30 AM', price: 350, total_seats: 40, booked_seats: [1, 2], amenities: ['AC', 'WiFi'] }
      ]
      setBuses(mockBuses)
      setFilteredBuses(mockBuses)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.get(`/api/buses?from=${from}&to=${to}&date=${date}`)
      setFilteredBuses(res.data?.data || res.data || [])
    } catch (err) {
      const results = buses.filter(bus => {
        const matchFrom = !from || bus.from_city.toLowerCase().includes(from.toLowerCase())
        const matchTo = !to || bus.to_city.toLowerCase().includes(to.toLowerCase())
        return matchFrom && matchTo
      })
      setFilteredBuses(results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-[calc(100vh-72px)] bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-border mb-8">
            <h1 className="text-3xl font-bold mb-6 text-primary">Search Buses</h1>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">From</label>
                <input
                  type="text"
                  placeholder="e.g., Hyderabad"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">To</label>
                <input
                  type="text"
                  placeholder="e.g., Vijayawada"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md disabled:bg-gray-400"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
            
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            <p className="text-sm text-text-muted mt-4 font-medium">Found {filteredBuses.length} buses</p>
          </div>

          <div className="space-y-4">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => <BusCard key={bus.id} bus={bus} />)
            ) : (
              <div className="bg-white border border-dashed border-border rounded-xl text-center py-16 text-text-muted">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-medium text-gray-600">No buses found matching your criteria</p>
                <p className="mt-2 text-sm">Try adjusting your search filters or dates</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
