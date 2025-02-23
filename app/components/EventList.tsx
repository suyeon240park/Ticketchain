import EventCard from './EventCard'
import { Event } from '../types'

interface EventListProps {
  events: Event[]
  isOrganizer?: boolean
  onAddToCart?: (event: Event, quantity: number) => void
  onEditEvent?: (event: Event) => void
  onDeleteEvent?: (eventId: string) => void
}

export default function EventList({ events, isOrganizer = false, onAddToCart, onEditEvent, onDeleteEvent }: EventListProps) {
  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isOrganizer={isOrganizer}
          onAddToCart={onAddToCart}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </div>
  )
}

