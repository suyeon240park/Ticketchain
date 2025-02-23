'use client'

import { set } from 'mongoose';
import { useState } from 'react'

interface EventFormProps {
  onSubmit: (event: { name: string; date: string; price: number; maxResaleCap: number; location: string }) => void
}

export default function EventForm({ onSubmit }: EventFormProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [maxResaleCap, setMaxResaleCap] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, date, price: Number(price), maxResaleCap: Number(maxResaleCap), location})
    setName('')
    setDate('')
    setPrice('')
    setLocation('')
    setMaxResaleCap('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-1">
          Event Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="price" className="block mb-1">
          Ticket Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="maxResaleCap" className="block mb-1">
          Resale Price Cap
        </label>
        <input
          type="number"
          id="maxResaleCap"
          value={maxResaleCap}
          onChange={(e) => setMaxResaleCap(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-1">
          Event Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Event
      </button>
    </form>
  )
}

