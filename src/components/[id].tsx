import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setSelectedFamily } from '../../store/familiesSlice'
import { setFamilyMembers, setSelectedMember } from '../../store/familyMembersSlice'
import { getFamilyMembers } from '../../app/actions'
import FamilyTree from '../../components/FamilyTree'
import FamilyMemberModal from '../../components/FamilyMemberModal'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSocket } from '../../hooks/useSocket'
import { FamilyMember } from '../../types/family'

export default function FamilyPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { id } = router.query as { id: string }

  const selectedFamily = useSelector((state: RootState) => state.families.selectedFamily)
  const familyMembers = useSelector((state: RootState) => state.familyMembers.familyMembers)
  const selectedMember = useSelector((state: RootState) => state.familyMembers.selectedMember)

  const { updateMember, addMember, deleteMember } = useSocket(id)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<'add' | 'edit' | 'addChild' | 'addPartner'>('add')

  useEffect(() => {
    if (id) {
      dispatch(setSelectedFamily({ id, name: 'Loading...' }))
      loadFamilyMembers(id)
    }
  }, [id, dispatch])

  const loadFamilyMembers = useCallback(async (familyId: string) => {
    try {
      const members = await getFamilyMembers(familyId)
      dispatch(setFamilyMembers(members))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load family members. Please try again.",
        variant: "destructive",
      })
    }
  }, [dispatch, toast])

  const handleNodeClick = useCallback((memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId)
    if (member) {
      dispatch(setSelectedMember(member))
    }
  }, [familyMembers, dispatch])

  const handleModalSubmit = useCallback((member: Partial<FamilyMember>) => {
    if (modalMode === 'edit' && member.id) {
      updateMember(member.id, member)
    } else {
      addMember(member)
    }
    setIsModalOpen(false)
    toast({
      title: modalMode === 'edit' ? "Member Updated" : "Member Added",
      description: `${member.name} has been successfully ${modalMode === 'edit' ? 'updated' : 'added'}.`,
    })
  }, [modalMode, updateMember, addMember, toast])

  const handleDeleteMember = useCallback(() => {
    if (selectedMember) {
      deleteMember(selectedMember.id)
      dispatch(setSelectedMember(null))
      toast({
        title: "Member Deleted",
        description: `${selectedMember.name} has been successfully deleted.`,
      })
    }
  }, [selectedMember, deleteMember, dispatch, toast])

  if (!selectedFamily) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedFamily.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{selectedFamily.description}</p>
            </div>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">{selectedMember.name}</h2>
            <p>Birth Date: {selectedMember.birth_date}</p>
            <div className="mt-4 space-x-2">
              <Button onClick={() => { setModalMode('edit'); setIsModalOpen(true); }}>
                Edit
              </Button>
              <Button onClick={() => { setModalMode('addChild'); setIsModalOpen(true); }}>
                Add Child
              </Button>
              <Button onClick={() => { setModalMode('addPartner'); setIsModalOpen(true); }}>
                Add Partner
              </Button>
              <Button onClick={handleDeleteMember} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        )}
      </main>

      <FamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        member={modalMode === 'edit' ? selectedMember || undefined : undefined}
        mode={modalMode}
        parentId={modalMode === 'addChild' ? selectedMember?.id : undefined}
        partnerId={modalMode === 'addPartner' ? selectedMember?.id : undefined}
        familyId={id}
      />
    </div>
  )
}

