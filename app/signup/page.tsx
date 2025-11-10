"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getUserByEmail, saveUser } from "@/lib/storage"
import { setAuthUser } from "@/lib/auth"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (getUserByEmail(formData.email)) {
      setError("Email already registered")
      return
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    }

    saveUser(newUser)
    setAuthUser({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    })

    window.location.href = "/search"
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-(--color-surface) flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

          {error && <div className="bg-(--color-error) text-white p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border border-(--color-border) rounded px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-(--color-primary) text-white py-2 rounded font-semibold hover:bg-(--color-primary-dark)"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-(--color-primary) font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
