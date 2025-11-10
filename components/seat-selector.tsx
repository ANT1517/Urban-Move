"use client"

import type { Bus } from "@/lib/storage"

interface SeatSelectorProps {
  bus: Bus
  selectedSeats: number[]
  onSeatSelect: (seat: number) => void
}

export default function SeatSelector({ bus, selectedSeats, onSeatSelect }: SeatSelectorProps) {
  const rows = Math.ceil(bus.totalSeats / 5)
  const seatsPerRow = 5

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="text-center">
          <div className="text-(--color-text-muted) font-semibold mb-4">Front of Bus</div>
          <div className="inline-block bg-gray-100 p-4 rounded">
            <div className="space-y-3">
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-3 justify-center">
                  {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
                    const seatNumber = rowIdx * seatsPerRow + colIdx + 1
                    if (seatNumber > bus.totalSeats) return null

                    const isBooked = bus.bookedSeats.includes(seatNumber)
                    const isSelected = selectedSeats.includes(seatNumber)

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => onSeatSelect(seatNumber)}
                        disabled={isBooked}
                        className={`w-12 h-12 rounded font-semibold transition ${
                          isBooked
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : isSelected
                              ? "bg-(--color-primary) text-white"
                              : "bg-white border-2 border-(--color-border) hover:border-(--color-primary)"
                        }`}
                      >
                        {seatNumber}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border-2 border-(--color-border) rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-(--color-primary) rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}
