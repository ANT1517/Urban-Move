"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthUser } from "@/lib/auth"
import { getBusById, type Bus } from "@/lib/storage"
import SeatSelector from "@/components/seat-selector"

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(() => getAuthUser())
  const [bus, setBus] = useState<Bus | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [passengerInfo, setPassengerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [step, setStep] = useState<"seats" | "info" | "payment">("seats")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const busId = Array.isArray(params.id) ? params.id[0] : params.id
    const busData = getBusById(busId)
    if (!busData) {
      router.push("/search")
      return
    }
    setBus(busData)
  }, [user, router, params])

  const handleSeatSelect = (seat: number) => {
    if (bus && !bus.bookedSeats.includes(seat)) {
      setSelectedSeats((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]))
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }
    setStep("info")
  }

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passengerInfo.name || !passengerInfo.phone || !passengerInfo.email) {
      alert("Please fill all passenger details")
      return
    }
    setStep("payment")
  }

  if (!user || !bus) {
    return null
  }

  const totalPrice = selectedSeats.length * bus.price

  return (
    <div>
      <Navbar />
      <main className="bg-(--color-surface) min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <div className={`text-center flex-1 ${step === "seats" ? "font-bold" : ""}`}>
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step !== "seats" ? "bg-(--color-primary) text-white" : "bg-(--color-primary) text-white"
                  }`}
                >
                  1
                </div>
                Select Seats
              </div>
              <div className={`text-center flex-1 ${step === "info" ? "font-bold" : ""}`}>
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step === "info" ? "bg-(--color-primary) text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                Passenger Info
              </div>
              <div className={`text-center flex-1 ${step === "payment" ? "font-bold" : ""}`}>
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step === "payment" ? "bg-(--color-primary) text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                Payment
              </div>
            </div>
          </div>

          {/* Bus Info */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-(--color-text-muted) text-xs uppercase">Bus</p>
                <p className="font-bold">{bus.name}</p>
              </div>
              <div>
                <p className="text-(--color-text-muted) text-xs uppercase">Route</p>
                <p className="font-bold">
                  {bus.from} → {bus.to}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-muted) text-xs uppercase">Time</p>
                <p className="font-bold">
                  {bus.departureTime} - {bus.arrivalTime}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-muted) text-xs uppercase">Selected Seats</p>
                <p className="font-bold text-(--color-primary)">{selectedSeats.length}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === "seats" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
              <SeatSelector bus={bus} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />

              <div className="mt-8 flex justify-between items-center border-t pt-6">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-(--color-border) rounded font-semibold hover:bg-gray-100"
                >
                  Back
                </button>
                <div className="text-right">
                  <p className="text-(--color-text-muted) text-sm">Total Price</p>
                  <p className="text-3xl font-bold text-(--color-primary)">${totalPrice}</p>
                </div>
                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className="px-6 py-2 bg-(--color-primary) text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === "info" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded">
                <p className="text-sm">
                  <strong>Selected Seats:</strong> {selectedSeats.join(", ")}
                </p>
                <p className="text-sm">
                  <strong>Total Price:</strong> ${totalPrice}
                </p>
              </div>

              <form onSubmit={handlePassengerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={passengerInfo.name}
                    onChange={(e) => setPassengerInfo({ ...passengerInfo, name: e.target.value })}
                    className="w-full border border-(--color-border) rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={passengerInfo.email}
                    onChange={(e) => setPassengerInfo({ ...passengerInfo, email: e.target.value })}
                    className="w-full border border-(--color-border) rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={passengerInfo.phone}
                    onChange={(e) => setPassengerInfo({ ...passengerInfo, phone: e.target.value })}
                    className="w-full border border-(--color-border) rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setStep("seats")}
                    className="flex-1 px-6 py-2 border border-(--color-border) rounded font-semibold hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-(--color-primary) text-white rounded font-semibold hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Payment</h2>

              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span>Bus: {bus.name}</span>
                  <span className="font-semibold">
                    {bus.from} → {bus.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Seats: {selectedSeats.join(", ")}</span>
                  <span className="font-semibold">{selectedSeats.length} seat(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per seat</span>
                  <span className="font-semibold">${bus.price}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-(--color-primary)">${totalPrice}</span>
                </div>
              </div>

              <PaymentForm
                totalPrice={totalPrice}
                busId={bus.id}
                selectedSeats={selectedSeats}
                passengerInfo={passengerInfo}
              />

              <button
                onClick={() => setStep("info")}
                className="w-full px-6 py-2 border border-(--color-border) rounded font-semibold hover:bg-gray-100 mt-4"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PaymentForm({ totalPrice, busId, selectedSeats, passengerInfo }: any) {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      alert("Please fill all payment details")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const { getBusById, saveBus, saveBooking } = require("@/lib/storage")
      const { getAuthUser } = require("@/lib/auth")

      const bus = getBusById(busId)
      const user = getAuthUser()

      if (bus && user) {
        // Update bus booked seats
        bus.bookedSeats = [...bus.bookedSeats, ...selectedSeats]
        saveBus(bus)

        // Save booking
        const booking = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          busId: busId,
          seats: selectedSeats,
          totalPrice: totalPrice,
          passengerName: passengerInfo.name,
          passengerPhone: passengerInfo.phone,
          date: new Date().toISOString(),
          status: "confirmed" as const,
        }

        saveBooking(booking)
        setIsProcessing(false)
        router.push(`/confirmation/${booking.id}`)
      }
    }, 2000)
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
          className="w-full border border-(--color-border) rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cardholder Name</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="w-full border border-(--color-border) rounded px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-(--color-border) rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            className="w-full border border-(--color-border) rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-(--color-primary) text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-300"
      >
        {isProcessing ? "Processing..." : `Pay $${totalPrice}`}
      </button>
    </form>
  )
}
