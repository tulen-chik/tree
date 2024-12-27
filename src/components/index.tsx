import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FamilyTreeApp</h1>
          <div>
            <Link href="/login" passHref>
              <Button variant="ghost" className="mr-2">Login</Button>
            </Link>
            <Link href="/register" passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Discover Your Family History</h2>
        <p className="text-xl mb-8">Create, explore, and share your family tree with ease.</p>
        <Link href="/register" passHref>
          <Button size="lg">Get Started</Button>
        </Link>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p>Our intuitive interface makes building your family tree simple and enjoyable.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
            <p>Invite family members to contribute and grow your tree together.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Visualize</h3>
            <p>See your family history come to life with our interactive tree view.</p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2023 FamilyTreeApp. All rights reserved.</p>
      </footer>
    </div>
  )
}

