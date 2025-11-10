"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthUser } from "@/lib/auth"
import { getUserBookings, getBusById, type Booking, type Bus } from "@/lib/storage"

export default function BookingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(() => getAuthUser())
  const [bookings, setBookings] = useState<(Booking & { bus?: Bus })[]>([])
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const userBookings = getUserBookings(user.id)
    const bookingsWithBusDetails = userBookings.map((booking) => ({
      ...booking,
      bus: getBusById(booking.busId),
    }))

    setBookings(bookingsWithBusDetails)
  }, [user, router])

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  if (!user) {
    return null
  }

  return (
    <div>
      <Navbar />
      <main className="bg-(--color-surface) min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded font-semibold capitalize transition ${
                  filter === status
                    ? "bg-(--color-primary) text-white"
                    : "bg-white border border-(--color-border) hover:border-(--color-primary)"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Bus</p>
                      <p className="font-bold text-lg">{booking.bus?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Route</p>
                      <p className="font-bold text-lg">
                        {booking.bus?.from} → {booking.bus?.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Seats</p>
                      <p className="font-bold text-lg">{booking.seats.join(", ")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-(--color-border)">
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Departure</p>
                      <p className="font-semibold">{booking.bus?.departureTime}</p>
                      <p className="text-xs text-(--color-text-muted)">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Total Price</p>
                      <p className="font-bold text-xl text-(--color-primary)">${booking.totalPrice}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-(--color-text-muted) uppercase">Status</p>
                        <p
                          className={`font-semibold capitalize px-3 py-1 rounded text-xs w-fit ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/confirmation/${booking.id}`)}
                        className="text-(--color-primary) font-semibold hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <p className="text-lg text-(--color-text-muted) mb-4">
                  {filter === "all" ? "You haven't booked any buses yet" : `No ${filter} bookings found`}
                </p>
                <button
                  onClick={() => router.push("/search")}
                  className="bg-(--color-primary) text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Search Buses
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
