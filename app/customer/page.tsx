'use client'

import { useState } from 'react'
import EventList from '../components/EventList'
import Cart from '../components/Cart'
import { Event } from '../types'
import useEvents from '../../hooks/useEvents';
import {useTickets} from '../../hooks/useTickets';
import dotenv from 'dotenv';

dotenv.config();

export default function CustomerPage() {
  const [cartItems, setCartItems] = useState<{ event: Event; quantity: number }[]>([])
  const { events, addEvent, editEvent, deleteEvent } = useEvents();
  const { buyTickets, showTickets, loading, error} = useTickets();
  const addToCart = (event: Event, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.event.id === event.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.event.id === event.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevItems, { event, quantity }]
    })
  }

  const updateCartItemQuantity = (eventId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.event.id === eventId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter((item) => item.quantity > 0)
    )
  }

  const removeCartItem = (eventId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.event.id !== eventId))
  }

  const handleCheckout = async () => {
    // Implement checkout logic here
    const userId = "67b6c218325907d43b7210d5";
    if (!userId) {
      console.error('User ID not found in environment variables.');
      return;
    }
    const success = await buyTickets(userId, cartItems);
    
    if (success) {
      alert('Thank you for your purchase!');
      setCartItems([]); // Clear the cart after successful checkout
    } else {
      alert('Checkout failed. Please try again.');
    }
    setCartItems([])
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Events</h1>
      <EventList events={events} onAddToCart={addToCart} />
      <Cart
        items={cartItems}
        onUpdateQuantity={updateCartItemQuantity}
        onRemove={removeCartItem}
        onCheckout={handleCheckout}
      />
    </main>
  )
}

