import React, { useState, useEffect } from 'react'
import { FamilyMember } from '../types/family'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Partial<FamilyMember>) => void;
  member?: FamilyMember;
  mode: 'add' | 'edit' | 'addChild' | 'addPartner';
  parentId?: string;
  partnerId?: string;
  familyId: string;
}

export default function FamilyMemberModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member, 
  mode,
  parentId,
  partnerId,
  familyId
}: FamilyMemberModalProps) {
  const [name, setName] = useState(member?.name || '')
  const [birthDate, setBirthDate] = useState(member?.birth_date || '')

  useEffect(() => {
    if (member) {
      setName(member.name)
      setBirthDate(member.birth_date)
    } else {
      setName('')
      setBirthDate('')
    }
  }, [member])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember: Partial<FamilyMember> = { 
      name, 
      birth_date: birthDate,
      family_id: familyId
    }
    if (mode === 'edit' && member) {
      newMember.id = member.id
    }
    if (mode === 'addChild') {
      newMember.parent_id = parentId
    }
    if (mode === 'addPartner') {
      newMember.partner_id = partnerId
    }
    onSubmit(newMember)
    onClose()
  }

  const title = {
    add: 'Add Family Member',
    edit: 'Edit Family Member',
    addChild: 'Add Child',
    addPartner: 'Add Partner'
  }[mode]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

