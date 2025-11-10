"use client"

import { useState } from "react"
import Link from "next/link"
import { getAuthUser, clearAuthUser } from "@/lib/auth"

export default function Navbar() {
  const [user, setUser] = useState(() => getAuthUser())
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuthUser()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="bg-(--color-primary) text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BusBook
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {user ? (
            <>
              <Link href="/search" className="hover:text-blue-200">
                Search
              </Link>
              <Link href="/bookings" className="hover:text-blue-200">
                My Bookings
              </Link>
              <Link href="/admin" className="hover:text-blue-200">
                Admin
              </Link>
              <span className="text-sm">{user.name}</span>
              <button onClick={handleLogout} className="bg-(--color-accent) px-4 py-2 rounded hover:opacity-90">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link href="/signup" className="bg-(--color-accent) px-4 py-2 rounded hover:opacity-90">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-(--color-primary-dark) px-4 py-2 space-y-2">
          {user ? (
            <>
              <Link href="/search" className="block hover:text-blue-200">
                Search
              </Link>
              <Link href="/bookings" className="block hover:text-blue-200">
                My Bookings
              </Link>
              <Link href="/admin" className="block hover:text-blue-200">
                Admin
              </Link>
              <button onClick={handleLogout} className="block w-full text-left bg-(--color-accent) px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:text-blue-200">
                Login
              </Link>
              <Link href="/signup" className="block hover:text-blue-200">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
