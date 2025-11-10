"use client"

import Link from "next/link"
import type { Bus } from "@/lib/storage"

interface BusCardProps {
  bus: Bus
}

export default function BusCard({ bus }: BusCardProps) {
  const availableSeats = bus.totalSeats - bus.bookedSeats.length
  const occupancyPercent = (bus.bookedSeats.length / bus.totalSeats) * 100

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Route & Times */}
        <div>
          <h3 className="font-bold text-lg">{bus.name}</h3>
          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-(--color-primary)">{bus.departureTime}</p>
            <p className="text-xs text-(--color-text-muted)">{bus.from}</p>
            <p className="text-xs my-1">→</p>
            <p className="text-sm font-semibold text-(--color-primary)">{bus.arrivalTime}</p>
            <p className="text-xs text-(--color-text-muted)">{bus.to}</p>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-semibold mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {bus.amenities.map((amenity, idx) => (
              <span key={idx} className="bg-blue-100 text-(--color-primary) text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <p className="text-sm font-semibold mb-2">Availability</p>
          <div className="mb-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-(--color-primary) h-2 rounded-full transition"
                style={{ width: `${occupancyPercent}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm">
            {availableSeats}/{bus.totalSeats} seats available
          </p>
          {availableSeats === 0 && <p className="text-xs text-red-500 font-semibold mt-1">Sold Out</p>}
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-(--color-text-muted)">Price per seat</p>
            <p className="text-3xl font-bold text-(--color-primary)">${bus.price}</p>
          </div>
          <Link
            href={`/booking/${bus.id}`}
            className={`w-full py-2 rounded font-semibold text-center transition ${
              availableSeats === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-(--color-primary) text-white hover:bg-blue-700"
            }`}
            onClick={(e) => {
              if (availableSeats === 0) {
                e.preventDefault()
              }
            }}
          >
            Select Seats
          </Link>
        </div>
      </div>
    </div>
  )
}
