import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Button } from "@/components/ui/button"

interface FamilyListProps {
  onSelectFamily: (familyId: string) => void
  onCreateFamily: () => void
}

export default function FamilyList({ onSelectFamily, onCreateFamily }: FamilyListProps) {
  const families = useSelector((state: RootState) => state.families.families)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Families</h2>
      {families.map((family) => (
        <div key={family.id} className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold">{family.name}</h3>
          <p className="text-gray-600 mt-1">{family.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">Plan: {family.plan_id}</span>
            <Button onClick={() => onSelectFamily(family.id)}>View Tree</Button>
          </div>
        </div>
      ))}
      <Button onClick={onCreateFamily}>Create New Family</Button>
    </div>
  )
}

