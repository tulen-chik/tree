import { useEffect, useRef, useCallback } from 'react'
import io, { Socket } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../store/familyMembersSlice'
import { FamilyMember } from '../types/family'

export function useSocket(familyId: string) {
  const socketRef = useRef<Socket | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_APP_URL as string, {
      path: '/api/socketio',
    })

    const socket = socketRef.current

    socket.emit('join family', familyId)

    socket.on('initial family data', (familyMembers: FamilyMember[]) => {
      familyMembers.forEach(member => dispatch(addFamilyMember(member)))
    })

    socket.on('family member updated', (updatedMember: FamilyMember) => {
      dispatch(updateFamilyMember(updatedMember))
    })

    socket.on('family member added', (newMember: FamilyMember) => {
      dispatch(addFamilyMember(newMember))
    })

    socket.on('family member deleted', (memberId: string) => {
      dispatch(deleteFamilyMember(memberId))
    })

    return () => {
      socket.emit('leave family', familyId)
      socket.disconnect()
    }
  }, [familyId, dispatch])

  const updateMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    socketRef.current?.emit('update family member', { familyId, memberId, updates })
  }, [familyId])

  const addMember = useCallback((newMember: Partial<FamilyMember>) => {
    socketRef.current?.emit('add family member', { familyId, newMember })
  }, [familyId])

  const deleteMember = useCallback((memberId: string) => {
    socketRef.current?.emit('delete family member', { familyId, memberId })
  }, [familyId])

  return { updateMember, addMember, deleteMember }
}

