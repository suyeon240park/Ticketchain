'use client'
import { useState } from 'react'
import EventForm from '../components/EventForm'
import EventList from '../components/EventList'
import { Event } from '../types'
import useEvents from '../../hooks/useEvents';
export default function OrganizerPage() {
  const { events, addEvent, getEventById } = useEvents()
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Organizer Dashboard</h1>
      <EventForm onSubmit={addEvent} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Events</h2>
      <EventList
        events={events}
        isOrganizer={true}
      />
    </main>
  )
}

