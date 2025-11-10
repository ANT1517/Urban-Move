"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthUser } from "@/lib/auth"
import { getBuses, getBookings, saveBus, type Bus } from "@/lib/storage"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(() => getAuthUser())
  const [buses, setBuses] = useState<Bus[]>([])
  const [bookings, setBookings] = useState(getBookings())
  const [tab, setTab] = useState<"overview" | "buses" | "add-bus">("overview")
  const [formData, setFormData] = useState({
    name: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const allBuses = getBuses()
    setBuses(allBuses)
  }, [user, router])

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.from || !formData.to || !formData.price || !formData.totalSeats) {
      alert("Please fill all fields")
      return
    }

    const newBus: Bus = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      bookedSeats: [],
      date: new Date().toISOString().split("T")[0],
      amenities: ["WiFi", "AC"],
    }

    saveBus(newBus)
    setBuses([...buses, newBus])
    setFormData({
      name: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      totalSeats: "",
    })
    setTab("buses")
    alert("Bus added successfully!")
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalBookings = bookings.length
  const totalSeatsBooked = bookings.reduce((sum, b) => sum + b.seats.length, 0)

  if (!user) {
    return null
  }

  return (
    <div>
      <Navbar />
      <main className="bg-(--color-surface) min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-(--color-border)">
            {(["overview", "buses", "add-bus"] as const).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                className={`px-4 py-2 font-semibold capitalize transition border-b-2 ${
                  tab === tabName
                    ? "border-(--color-primary) text-(--color-primary)"
                    : "border-transparent text-(--color-text-muted) hover:text-(--color-primary)"
                }`}
              >
                {tabName.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-sm text-(--color-text-muted) uppercase mb-2">Total Revenue</p>
                  <p className="text-4xl font-bold text-(--color-primary)">${totalRevenue}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-sm text-(--color-text-muted) uppercase mb-2">Total Bookings</p>
                  <p className="text-4xl font-bold text-(--color-primary)">{totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-sm text-(--color-text-muted) uppercase mb-2">Seats Booked</p>
                  <p className="text-4xl font-bold text-(--color-primary)">{totalSeatsBooked}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-(--color-border)">
                      <tr>
                        <th className="text-left py-2">Booking ID</th>
                        <th className="text-left py-2">Passenger</th>
                        <th className="text-left py-2">Seats</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(-5).map((booking) => (
                        <tr key={booking.id} className="border-b border-(--color-border)">
                          <td className="py-2 font-mono text-xs">#{booking.id}</td>
                          <td className="py-2">{booking.passengerName}</td>
                          <td className="py-2">{booking.seats.join(", ")}</td>
                          <td className="py-2 font-semibold">${booking.totalPrice}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Buses Tab */}
          {tab === "buses" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Manage Buses</h2>
              {buses.map((bus) => (
                <div key={bus.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Bus</p>
                      <p className="font-bold">{bus.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Route</p>
                      <p className="font-bold">
                        {bus.from} → {bus.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Price</p>
                      <p className="font-bold">${bus.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase">Seats</p>
                      <p className="font-bold">
                        {bus.totalSeats - bus.bookedSeats.length}/{bus.totalSeats}
                      </p>
                    </div>
                    <div className="flex items-end justify-end">
                      <button className="text-(--color-primary) font-semibold hover:underline">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Bus Tab */}
          {tab === "add-bus" && (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Add New Bus</h2>
              <form onSubmit={handleAddBus} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bus Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Departure Time</label>
                    <input
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Arrival Time</label>
                    <input
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price per Seat ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Seats</label>
                    <input
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      className="w-full border border-(--color-border) rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-(--color-primary) text-white py-2 rounded font-semibold hover:bg-blue-700 mt-6"
                >
                  Add Bus
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
