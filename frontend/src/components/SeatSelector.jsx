export default function SeatSelector({ bus, selectedSeats, onSeatSelect }) {
  const rows = Math.ceil(bus.total_seats / 5)
  const seatsPerRow = 5 

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="text-center">
           <div className="text-text-muted font-semibold mb-4 uppercase tracking-wider text-xs">Driver Side</div>
          <div className="inline-block bg-surface p-6 rounded-xl border border-border shadow-inner">
            <div className="space-y-4">
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-4 justify-center items-center">
                  {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
                    const seatNumber = rowIdx * seatsPerRow + colIdx + 1
                    if (seatNumber > bus.total_seats) return null

                    const isBooked = bus.booked_seats?.includes(seatNumber)
                    const isSelected = selectedSeats.includes(seatNumber)

                    const isAisle = colIdx === 1 || colIdx === 3; // Making layout 2+aisle+2+aisle? No, it's 5 seats. Let's do 2 + aisle + 3. So just colIdx === 1

                    return (
                       <div key={seatNumber} className="flex items-center">
                         <button
                           onClick={() => onSeatSelect(seatNumber)}
                           disabled={isBooked}
                           className={`w-12 h-12 rounded-lg shadow-sm font-semibold transition flex items-center justify-center ${
                             isBooked
                               ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
                               : isSelected
                                 ? "bg-accent text-white border border-accent transform scale-105"
                                 : "bg-white text-gray-700 border border-border hover:border-primary hover:text-primary"
                           }`}
                         >
                           {seatNumber}
                         </button>
                         {colIdx === 1 && <div className="w-8"></div>}
                       </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="text-text-muted font-semibold mt-4 uppercase tracking-wider text-xs">Back</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm mt-8 p-4 bg-white rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border border-border rounded"></div>
          <span className="text-gray-700 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent border border-accent rounded shadow-sm"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 border border-gray-400 rounded"></div>
          <span className="text-gray-700 font-medium">Booked</span>
        </div>
      </div>
    </div>
  )
}
