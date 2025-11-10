"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { getAuthUser } from "@/lib/auth"
import { getBuses, type Bus } from "@/lib/storage"
import BusCard from "@/components/bus-card"

export default function SearchPage() {
  const router = useRouter()
  const [user, setUser] = useState(() => getAuthUser())
  const [buses, setBuses] = useState<Bus[]>([])
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [priceRange, setPriceRange] = useState(100)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const allBuses = getBuses()
    setBuses(allBuses)
    setFilteredBuses(allBuses)
  }, [user, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const results = buses.filter((bus) => {
      const matchFrom = !from || bus.from.toLowerCase().includes(from.toLowerCase())
      const matchTo = !to || bus.to.toLowerCase().includes(to.toLowerCase())
      const matchDate = !date || bus.date === date
      const matchPrice = bus.price <= priceRange
      return matchFrom && matchTo && matchDate && matchPrice
    })

    setFilteredBuses(results)
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <Navbar />
      <main className="bg-(--color-surface) min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold mb-6">Search Buses</h1>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <input
                  type="text"
                  placeholder="e.g., New York"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full border border-(--color-border) rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <input
                  type="text"
                  placeholder="e.g., Boston"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full border border-(--color-border) rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-(--color-border) rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Price: ${priceRange}</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-(--color-primary) text-white py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>

            <p className="text-sm text-(--color-text-muted)">Found {filteredBuses.length} buses</p>
          </div>

          {/* Bus List */}
          <div className="space-y-4">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => <BusCard key={bus.id} bus={bus} />)
            ) : (
              <div className="text-center py-12 text-(--color-text-muted)">
                <p className="text-lg">No buses found matching your criteria</p>
                <p className="mt-2">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
