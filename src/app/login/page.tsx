"use client"

import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login to FamilyTreeApp</h2>
                <LoginForm />
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
            <Link href="/" passHref>
                <Button className="mt-8">Back to Home</Button>
            </Link>
        </div>
    )
}