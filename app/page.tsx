"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import { useState } from "react"
import { getAuthUser } from "@/lib/auth"

export default function Home() {
  const [user, setUser] = useState(() => getAuthUser())

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-(--color-primary) to-(--color-primary-dark) text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold mb-4">Book Your Bus Tickets Online</h1>
          <p className="text-xl mb-8 opacity-90">Fast, easy, and affordable bus bookings for your travels</p>

          {user ? (
            <div className="flex gap-4">
              <Link
                href="/search"
                className="bg-(--color-accent) text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 inline-block"
              >
                Search Buses
              </Link>
              <Link
                href="/bookings"
                className="bg-white text-(--color-primary) px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
              >
                My Bookings
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="bg-(--color-accent) text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 inline-block"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-(--color-primary) px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
