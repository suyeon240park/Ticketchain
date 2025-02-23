'use client'

interface TicketSelectorProps {
  onChange: (count: number) => void
  value: number
}

export default function TicketSelector({ onChange, value }: TicketSelectorProps) {
  const handleChange = (newCount: number) => {
    onChange(Math.max(0, newCount))
  }

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleChange(value - 1)}
        className="bg-gray-200 px-2 py-1 rounded-l"
        aria-label="Decrease ticket quantity"
      >
        -
      </button>
      <span className="bg-gray-100 px-4 py-1">{value}</span>
      <button
        onClick={() => handleChange(value + 1)}
        className="bg-gray-200 px-2 py-1 rounded-r"
        aria-label="Increase ticket quantity"
      >
        +
      </button>
    </div>
  )
}

