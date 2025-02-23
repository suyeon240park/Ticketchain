import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ticket Selling Platform',
  description: 'Buy and sell tickets for events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Ticketchain
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/customer" className="hover:underline">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/customer/my-tickets" className="hover:underline">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:underline">
                  Organizer
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

