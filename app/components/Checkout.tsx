'use client'

interface Event {
  id: number
  name: string
  date: string
  price: number
}

interface CheckoutProps {
  event: Event
  ticketCount: number
  onClose: () => void
}

export default function Checkout({ event, ticketCount, onClose }: CheckoutProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the payment process
    alert('Thank you for your purchase!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="mb-4">
          Event: {event.name}
          <br />
          Tickets: {ticketCount}
          <br />
          Total: ${event.price * ticketCount}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

