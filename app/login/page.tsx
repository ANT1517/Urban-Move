"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getUserByEmail } from "@/lib/storage"
import { setAuthUser } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = getUserByEmail(email)

    if (!user || user.password !== password) {
      setError("Invalid email or password")
      return
    }

    setAuthUser({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    window.location.href = "/search"
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-(--color-surface) flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          {error && <div className="bg-(--color-error) text-white p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-(--color-primary) text-white py-2 rounded font-semibold hover:bg-(--color-primary-dark)"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-(--color-primary) font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-6 p-4 bg-(--color-surface) rounded text-sm text-(--color-text-muted)">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: john@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </main>
    </div>
  )
}
