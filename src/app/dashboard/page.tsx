"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setUser } from '@/store/userSlice'
import { setFamilies, addFamily } from '@/store/familiesSlice'
import { supabase } from '@/utils/supabase'
import FamilyList from '@/components/FamilyList'
import CreateFamilyModal from '@/components/CreateFamilyModal'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createFamily, getFamilies } from '../actions'

export default function Dashboard() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { toast } = useToast()

    const user = useSelector((state: RootState) => state.user.user)
    const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = React.useState(false)

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                dispatch(setUser(session?.user ?? null))
            } else if (event === 'SIGNED_OUT') {
                dispatch(setUser(null))
                router.push('/login')
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [dispatch, router])

    useEffect(() => {
        if (user) {
            loadFamilies()
        }
    }, [user])

    const loadFamilies = async () => {
        try {
            const families = await getFamilies()
            dispatch(setFamilies(families))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load families. Please try again.",
            })
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        })
    }

    const handleCreateFamily = async (familyName: string, description: string, planId: number) => {
        try {
            const newFamily = await createFamily(familyName, description, planId)
            dispatch(addFamily(newFamily))
            setIsCreateFamilyModalOpen(false)
            toast({
                title: "Family Created",
                description: `${familyName} has been successfully created.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to create family: ${error instanceof Error ? error.message : 'Unknown error'}`,
            })
        }
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Family Tree Dashboard</h1>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <FamilyList
                    onSelectFamily={(familyId) => router.push(`/family/${familyId}`)}
                    onCreateFamily={() => setIsCreateFamilyModalOpen(true)}
                />
            </main>

            <CreateFamilyModal
                isOpen={isCreateFamilyModalOpen}
                onClose={() => setIsCreateFamilyModalOpen(false)}
                onSubmit={handleCreateFamily}
            />
        </div>
    )
}

