import React from 'react'
import { FamilyMember } from '../types/family'
import { Button } from "@/components/ui/button"

interface FamilyMemberProps {
  member: FamilyMember
  onEdit: (member: FamilyMember) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string) => void
  onAddPartner: (memberId: string) => void
}

export default function FamilyMemberComponent({ 
  member, 
  onEdit, 
  onDelete, 
  onAddChild, 
  onAddPartner 
}: FamilyMemberProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
      <p className="text-gray-600 mb-2">Birth Date: {member.birth_date}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => onEdit(member)}>
          Edit
        </Button>
        <Button variant="outline" onClick={() => onDelete(member.id)}>
          Delete
        </Button>
        <Button variant="outline" onClick={() => onAddChild(member.id)}>
          Add Child
        </Button>
        <Button variant="outline" onClick={() => onAddPartner(member.id)}>
          Add Partner
        </Button>
      </div>
    </div>
  )
}

