'use client'

import { useState } from 'react'
import { Event } from '../types'

interface CartItem {
  event: Event
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (eventId: string, quantity: number) => void
  onRemove: (eventId: string) => void
  onCheckout: () => void
}

export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const [isOpen, setIsOpen] = useState(false)

  const totalPrice = items.reduce((sum, item) => sum + item.event.price * item.quantity, 0)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg"
        aria-label="Toggle cart"
      >
        🛒 ({items.reduce((sum, item) => sum + item.quantity, 0)})
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-white border rounded-lg shadow-xl p-4">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.event.id} className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold">{item.event.name}</h3>
                    <p className="text-sm text-gray-600">${item.event.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => onUpdateQuantity(item.event.id, Math.max(0, item.quantity - 1))}
                      className="bg-gray-200 px-2 py-1 rounded-l"
                      aria-label={`Decrease quantity for ${item.event.name}`}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 px-2 py-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.event.id, item.quantity + 1)}
                      className="bg-gray-200 px-2 py-1 rounded-r"
                      aria-label={`Increase quantity for ${item.event.name}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(item.event.id)}
                      className="ml-2 text-red-500"
                      aria-label={`Remove ${item.event.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <p className="font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <button
                  onClick={onCheckout}
                  className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

