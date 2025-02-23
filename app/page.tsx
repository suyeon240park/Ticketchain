import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/blockchain.jpg"
            alt="Blockchain"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            className="z-0"
          />
        </div>
        <div className="z-10 bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Ticket Selling Platform
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Fair, Transparent, and Hassle-Free Ticketing Powered by Blockchain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/organizer" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Organizers
            </Link>
            <Link href="/customer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Customers
            </Link>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="🔒"
            title="Fixed Pricing"
            description="Blockchain-powered fixed pricing ensures fair ticketing for all."
          />
          <FeatureCard
            icon="🔄"
            title="Secure Resale"
            description="Smart contracts enable secure ticket resale at face value."
          />
          <FeatureCard
            icon="🎫"
            title="Effortless Entry"
            description="Blockchain validation makes event entry quick and easy."
          />
          <FeatureCard
            icon="🖼️"
            title="NFT Tickets"
            description="Organizers can easily create NFT tickets for their events."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>Built for [LIVE AI Ivy Plus] Harvard-Duke Hackathon by Suyeon Park and Aabha Joseph</p>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/suyeon240park/Ticketchain" className="hover:underline">GitHub Repo</a>
            <a href="https://youtu.be/xSOGou9qy3A" className="hover:underline">Submission Video</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Define TypeScript props for FeatureCard
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
