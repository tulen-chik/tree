'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FamilyMember } from '../types/family'
import FamilyMemberComponent from '../components/FamilyMember'
import FamilyMemberModal from '../components/FamilyMemberModal'
import FamilyTree from '../components/FamilyTree'
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from './actions'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function Home() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'addChild' | 'addPartner'>('add')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const loadFamilyMembers = useCallback(async () => {
    try {
      const members = await getFamilyMembers()
      setFamilyMembers(members)
    } catch (error) {
      console.error('Failed to load family members:', error)
    }
  }, [])

  useEffect(() => {
    loadFamilyMembers()
  }, [loadFamilyMembers])

  const handleAddMember = useCallback(async (member: Partial<FamilyMember>) => {
    try {
      const newMember = await addFamilyMember(member)
      setFamilyMembers(prevMembers => [...prevMembers, newMember])
    } catch (error) {
      console.error('Failed to add family member:', error)
      alert(`Failed to add family member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [])

  const handleUpdateMember = useCallback(async (member: Partial<FamilyMember>) => {
    try {
      const updatedMember = await updateFamilyMember(member)
      setFamilyMembers(prevMembers => 
        prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
      )
    } catch (error) {
      console.error('Failed to update family member:', error)
      alert(`Failed to update family member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [])

  const handleDeleteMember = useCallback(async () => {
    if (!selectedMember) return
    try {
      await deleteFamilyMember(selectedMember.id)
      setFamilyMembers(prevMembers => prevMembers.filter(m => m.id !== selectedMember.id))
      setSelectedMember(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete family member:', error)
      alert(`Failed to delete family member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [selectedMember])

  const handleNodeClick = useCallback((memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId)
    if (member) {
      setSelectedMember(member)
    }
  }, [familyMembers])

  const handleModalSubmit = useCallback((member: Partial<FamilyMember>) => {
    if (modalMode === 'edit') {
      handleUpdateMember(member)
    } else {
      handleAddMember(member)
    }
    setIsModalOpen(false)
  }, [modalMode, handleUpdateMember, handleAddMember])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Family Tree</h1>
      <div className="mb-4">
        <FamilyTree members={familyMembers} onNodeClick={handleNodeClick} />
      </div>
      <Button
        onClick={() => {
          setModalMode('add')
          setIsModalOpen(true)
        }}
        className="mb-4"
      >
        Add Family Member
      </Button>
      {selectedMember && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Selected Family Member</h2>
          <FamilyMemberComponent
            member={selectedMember}
            onEdit={() => {
              setModalMode('edit')
              setIsModalOpen(true)
            }}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onAddChild={(parentId) => {
              setModalMode('addChild')
              setIsModalOpen(true)
            }}
            onAddPartner={(memberId) => {
              setModalMode('addPartner')
              setIsModalOpen(true)
            }}
          />
        </div>
      )}
      <FamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        member={modalMode === 'edit' ? selectedMember || undefined : undefined}
        mode={modalMode}
        parentId={modalMode === 'addChild' ? selectedMember?.id : undefined}
        partnerId={modalMode === 'addPartner' ? selectedMember?.id : undefined}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Family Member</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedMember?.name}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

