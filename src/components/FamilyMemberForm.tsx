import React, { useState, useEffect } from 'react'
import { FamilyMember } from '../types/family'

interface FamilyMemberFormProps {
  member?: FamilyMember
  onSubmit: (member: Partial<FamilyMember>) => void
  onCancel: () => void
}

export default function FamilyMemberForm({ member, onSubmit, onCancel }: FamilyMemberFormProps) {
  const [name, setName] = useState(member?.name || '')
  const [birthDate, setBirthDate] = useState(member?.birth_date || '')

  useEffect(() => {
    if (member) {
      setName(member.name)
      setBirthDate(member.birth_date)
    }
  }, [member])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, birth_date: birthDate, id: member?.id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {member ? 'Update' : 'Add'} Family Member
        </button>
      </div>
    </form>
  )
}

