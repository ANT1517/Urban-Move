"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthUser } from "@/lib/auth"
import { getBookings, getBusById, type Booking, type Bus } from "@/lib/storage"
import Link from "next/link"

export default function ConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(() => getAuthUser())
  const [booking, setBooking] = useState<Booking | null>(null)
  const [bus, setBus] = useState<Bus | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const bookingId = Array.isArray(params.id) ? params.id[0] : params.id
    const allBookings = getBookings()
    const foundBooking = allBookings.find((b) => b.id === bookingId)

    if (foundBooking) {
      setBooking(foundBooking)
      const busData = getBusById(foundBooking.busId)
      if (busData) setBus(busData)
    } else {
      router.push("/bookings")
    }
  }, [user, router, params])

  if (!user || !booking || !bus) {
    return null
  }

  return (
    <div>
      <Navbar />
      <main className="bg-(--color-surface) min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-(--color-primary) mb-2">Booking Confirmed!</h1>
            <p className="text-(--color-text-muted)">Your bus booking has been successfully confirmed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-8">
            <div>
              <p className="text-sm text-(--color-text-muted) uppercase">Booking Reference</p>
              <p className="text-2xl font-bold text-(--color-primary)">#{booking.id}</p>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-(--color-text-muted) uppercase mb-4">Journey Details</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Bus</span>
                  <span className="font-semibold">{bus.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Route</span>
                  <span className="font-semibold">
                    {bus.from} → {bus.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Departure</span>
                  <span className="font-semibold">{bus.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats</span>
                  <span className="font-semibold">{booking.seats.join(", ")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-(--color-primary)">
                  <span>Total Amount</span>
                  <span>${booking.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-(--color-text-muted) uppercase mb-4">Passenger Details</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span className="font-semibold">{booking.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <span className="font-semibold">{booking.passengerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/search"
              className="flex-1 bg-(--color-primary) text-white py-3 rounded font-semibold text-center hover:bg-blue-700"
            >
              Book Another Ticket
            </Link>
            <Link
              href="/bookings"
              className="flex-1 border border-(--color-border) py-3 rounded font-semibold text-center hover:bg-gray-100"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
