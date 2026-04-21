import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SeatSelector from "../components/SeatSelector"
import { useAuth } from "../context/AuthContext"
import api from "../lib/api"

function PaymentForm({ totalPrice, busId, selectedSeats, passengerInfo, onBack }) {
  const navigate = useNavigate()
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setError("Please fill all payment details")
      return
    }

    setIsProcessing(true)

    try {
      const res = await api.post('/api/bookings', {
        bus_id: busId,
        seats: selectedSeats,
        passenger_name: passengerInfo.name,
        passenger_phone: passengerInfo.phone,
        passenger_email: passengerInfo.email,
        total_price: totalPrice
      })
      navigate(`/confirmation/${res.data.id || res.data.data?.id}`)
    } catch (err) {
      if (err.response?.status === 409) {
         setError("One or more selected seats were just booked. Please select different seats.")
      } else {
         // Mock phase 1
         setTimeout(() => {
           navigate(`/confirmation/mock-booking-${Date.now()}`)
         }, 1000)
      }
    } finally {
      if(error) setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {error && <div className="bg-red-50 text-error border border-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
          className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Cardholder Name</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
         <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition shadow-md disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
      </div>
    </form>
  )
}

export default function Booking() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [bus, setBus] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerInfo, setPassengerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })
  const [step, setStep] = useState("seats") 
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await api.get(`/api/buses/${id}`)
        setBus(res.data?.data || res.data)
      } catch (err) {
        setBus({ id, name: 'TSRTC Garuda Plus', from_city: 'Hyderabad', to_city: 'Vijayawada', departure_time: '06:00 AM', arrival_time: '09:30 AM', price: 350, total_seats: 40, booked_seats: [1, 2] })
      }
    }
    fetchBus()
  }, [id])

  const handleSeatSelect = (seat) => {
    if (bus && !bus.booked_seats?.includes(seat)) {
      setSelectedSeats((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]))
    }
  }

  const handlePassengerSubmit = (e) => {
    e.preventDefault()
    if (!passengerInfo.name || !passengerInfo.phone || !passengerInfo.email) {
      alert("Please fill all details")
      return
    }
    setStep("payment")
  }

  if (!bus) return <div className="min-h-screen bg-surface flex items-center justify-center"><p>Loading...</p></div>

  const totalPrice = selectedSeats.length * bus.price

  return (
    <div>
      <Navbar />
      <main className="bg-surface min-h-[calc(100vh-72px)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-border">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transform -translate-y-1/2 transition-all duration-300" style={{ width: step === 'seats' ? '0%' : step === 'info' ? '50%' : '100%' }}></div>
              
              <div className={`text-center flex-1 bg-white inline-block`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold border-4 border-white ${step === "seats" || step === "info" || step === "payment" ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
                <span className={`text-xs uppercase tracking-wide font-semibold mt-2 block ${step === "seats" ? "text-primary" : "text-gray-500"}`}>Seats</span>
              </div>
              <div className={`text-center flex-1 bg-white inline-block`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold border-4 border-white ${step === "info" || step === "payment" ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
                <span className={`text-xs uppercase tracking-wide font-semibold mt-2 block ${step === "info" ? "text-primary" : "text-gray-500"}`}>Details</span>
              </div>
              <div className={`text-center flex-1 bg-white inline-block`}>
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold border-4 border-white ${step === "payment" ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>3</div>
                <span className={`text-xs uppercase tracking-wide font-semibold mt-2 block ${step === "payment" ? "text-primary" : "text-gray-500"}`}>Payment</span>
              </div>
            </div>
          </div>

          {/* Bus Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Bus</p>
                <p className="font-bold text-gray-900">{bus.name}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Route</p>
                <p className="font-bold text-gray-900">
                  {bus.from_city} → {bus.to_city}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Time</p>
                <p className="font-bold text-gray-900">
                  {bus.departure_time} - {bus.arrival_time}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Seats Selected</p>
                <p className="font-bold text-primary text-lg">{selectedSeats.length}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === "seats" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-border">
              <h2 className="text-2xl font-bold mb-8 text-primary border-b pb-4">Select Your Seats</h2>
              <SeatSelector bus={bus} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />

              <div className="mt-10 flex justify-between items-center border-t border-border pt-6">
                <button onClick={() => navigate(-1)} className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition">Back</button>
                <div className="text-right flex items-center gap-6">
                  <div>
                     <p className="text-text-muted text-sm font-medium">Total Amount</p>
                     <p className="text-3xl font-bold text-primary">₹{totalPrice}</p>
                  </div>
                  <button
                    onClick={() => setStep("info")}
                    disabled={selectedSeats.length === 0}
                    className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition shadow-md disabled:bg-gray-400 disabled:shadow-none"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "info" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-border flex justify-center">
               <div className="w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-4">Passenger Details</h2>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-700"><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-700"><strong>Amount:</strong> ₹{totalPrice}</p>
                    </div>
                  </div>

                  <form onSubmit={handlePassengerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                      <input type="text" value={passengerInfo.name} onChange={(e) => setPassengerInfo({ ...passengerInfo, name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                      <input type="email" value={passengerInfo.email} onChange={(e) => setPassengerInfo({ ...passengerInfo, email: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                      <input type="tel" value={passengerInfo.phone} onChange={(e) => setPassengerInfo({ ...passengerInfo, phone: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" required />
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-border">
                      <button type="button" onClick={() => setStep("seats")} className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition">Back</button>
                      <button type="submit" className="flex-[2] px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition shadow-md">Continue to Payment</button>
                    </div>
                  </form>
               </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-border flex justify-center">
               <div className="w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-4">Secure Payment</h2>

                  <div className="space-y-3 mb-8 p-6 bg-surface rounded-xl border border-border">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Bus Name</span>
                      <span className="font-semibold text-gray-900">{bus.name}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Seats</span>
                      <span className="font-semibold text-gray-900">{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Price per seat</span>
                      <span className="font-semibold text-gray-900">₹{bus.price}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total Payable</span>
                      <span className="text-primary">₹{totalPrice}</span>
                    </div>
                  </div>

                  <PaymentForm 
                    totalPrice={totalPrice} 
                    busId={bus.id} 
                    selectedSeats={selectedSeats} 
                    passengerInfo={passengerInfo} 
                    onBack={() => setStep("info")}
                  />
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
