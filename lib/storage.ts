// localStorage wrapper for managing app data

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
}

export interface Bus {
  id: string
  name: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  totalSeats: number
  bookedSeats: number[]
  date: string
  amenities: string[]
}

export interface Booking {
  id: string
  userId: string
  busId: string
  seats: number[]
  totalPrice: number
  passengerName: string
  passengerPhone: string
  date: string
  status: "pending" | "confirmed" | "cancelled"
}

// Users
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("users") || "[]")
}

export const saveUser = (user: User) => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem("users", JSON.stringify(users))
}

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find((u) => u.email === email)
}

// Buses
export const getBuses = (): Bus[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("buses")
  if (stored) return JSON.parse(stored)

  // Initialize with sample data
  const sampleBuses: Bus[] = [
    {
      id: "1",
      name: "Express Travels",
      from: "New York",
      to: "Boston",
      departureTime: "08:00 AM",
      arrivalTime: "12:00 PM",
      price: 45,
      totalSeats: 40,
      bookedSeats: [1, 2, 5, 8],
      date: new Date().toISOString().split("T")[0],
      amenities: ["WiFi", "Charging", "AC"],
    },
    {
      id: "2",
      name: "City Comfort Bus",
      from: "New York",
      to: "Boston",
      departureTime: "02:00 PM",
      arrivalTime: "06:00 PM",
      price: 55,
      totalSeats: 40,
      bookedSeats: [3, 7, 12],
      date: new Date().toISOString().split("T")[0],
      amenities: ["WiFi", "Meals", "AC", "Reclining Seats"],
    },
    {
      id: "3",
      name: "Budget Coach",
      from: "New York",
      to: "Washington DC",
      departureTime: "10:00 AM",
      arrivalTime: "04:00 PM",
      price: 35,
      totalSeats: 40,
      bookedSeats: [2, 4, 6, 9, 15],
      date: new Date().toISOString().split("T")[0],
      amenities: ["AC"],
    },
    {
      id: "4",
      name: "Premium Express",
      from: "New York",
      to: "Washington DC",
      departureTime: "06:00 PM",
      arrivalTime: "12:00 AM",
      price: 75,
      totalSeats: 40,
      bookedSeats: [1],
      date: new Date().toISOString().split("T")[0],
      amenities: ["WiFi", "Meals", "AC", "Reclining Seats", "USB Charging"],
    },
  ]

  localStorage.setItem("buses", JSON.stringify(sampleBuses))
  return sampleBuses
}

export const saveBus = (bus: Bus) => {
  const buses = getBuses()
  const index = buses.findIndex((b) => b.id === bus.id)
  if (index > -1) {
    buses[index] = bus
  } else {
    buses.push(bus)
  }
  localStorage.setItem("buses", JSON.stringify(buses))
}

export const getBusById = (id: string): Bus | undefined => {
  return getBuses().find((b) => b.id === id)
}

// Bookings
export const getBookings = (): Booking[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("bookings") || "[]")
}

export const saveBooking = (booking: Booking) => {
  const bookings = getBookings()
  bookings.push(booking)
  localStorage.setItem("bookings", JSON.stringify(bookings))
}

export const getUserBookings = (userId: string): Booking[] => {
  return getBookings().filter((b) => b.userId === userId)
}
