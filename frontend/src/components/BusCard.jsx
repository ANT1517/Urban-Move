import { Link } from "react-router-dom"

export default function BusCard({ bus }) {
  const availableSeats = bus.total_seats - (bus.booked_seats?.length || 0)
  const occupancyPercent = ((bus.booked_seats?.length || 0) / bus.total_seats) * 100

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Route & Times */}
        <div>
          <h3 className="font-bold text-lg text-primary">{bus.name}</h3>
          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-gray-900">{bus.departure_time}</p>
            <p className="text-xs text-text-muted">{bus.from_city}</p>
            <p className="text-xs my-1 text-gray-400">↓</p>
            <p className="text-sm font-semibold text-gray-900">{bus.arrival_time}</p>
            <p className="text-xs text-text-muted">{bus.to_city}</p>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-semibold mb-2 text-gray-700">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {bus.amenities?.map((amenity, idx) => (
               <span key={idx} className="bg-surface text-primary text-xs px-2 py-1 rounded border border-border">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <p className="text-sm font-semibold mb-2 text-gray-700">Availability</p>
          <div className="mb-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${occupancyPercent}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {availableSeats}/{bus.total_seats} seats available
          </p>
          {availableSeats === 0 && <p className="text-xs text-error font-semibold mt-1">Sold Out</p>}
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center gap-3 border-l border-border pl-4">
          <div className="text-center">
            <p className="text-xs text-text-muted">Price per seat</p>
            <p className="text-3xl font-bold text-primary">₹{bus.price}</p>
          </div>
          <Link
            to={`/booking/${bus.id}`}
            className={`w-full py-2 rounded-lg font-semibold text-center transition shadow-sm ${
              availableSeats === 0
                ? "bg-gray-200 text-gray-400 pointer-events-none"
                : "bg-primary text-white hover:bg-primary-dark hover:shadow-md"
            }`}
          >
            Select Seats
          </Link>
        </div>
      </div>
    </div>
  )
}
