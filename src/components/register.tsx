import React from 'react'
import Link from 'next/link'
import RegisterForm from '../components/RegisterForm'
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <RegisterForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Link href="/" passHref className="mt-8">
        <Button variant="ghost">Back to Home</Button>
      </Link>
    </div>
  )
}

