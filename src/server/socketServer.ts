import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('join family', async (familyId) => {
      socket.join(familyId)
      console.log(`User joined family: ${familyId}`)

      // Fetch and send initial family data
      try {
        const { data: familyMembers, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('family_id', familyId)

        if (error) throw error

        socket.emit('initial family data', familyMembers)
      } catch (error) {
        console.error('Error fetching initial family data:', error)
      }
    })

    socket.on('leave family', (familyId) => {
      socket.leave(familyId)
      console.log(`User left family: ${familyId}`)
    })

    socket.on('update family member', async (data) => {
      const { familyId, memberId, updates } = data
      try {
        const { data: updatedMember, error } = await supabase
          .from('family_members')
          .update(updates)
          .eq('id', memberId)
          .eq('family_id', familyId)
          .select()
          .single()

        if (error) throw error

        io.to(familyId).emit('family member updated', updatedMember)
      } catch (error) {
        console.error('Error updating family member:', error)
        socket.emit('update error', { message: 'Failed to update family member' })
      }
    })

    socket.on('add family member', async (data) => {
      const { familyId, newMember } = data
      try {
        const { data: addedMember, error } = await supabase
          .from('family_members')
          .insert({ ...newMember, family_id: familyId })
          .select()
          .single()

        if (error) throw error

        io.to(familyId).emit('family member added', addedMember)
      } catch (error) {
        console.error('Error adding family member:', error)
        socket.emit('add error', { message: 'Failed to add family member' })
      }
    })

    socket.on('delete family member', async (data) => {
      const { familyId, memberId } = data
      try {
        const { error } = await supabase
          .from('family_members')
          .delete()
          .eq('id', memberId)
          .eq('family_id', familyId)

        if (error) throw error

        io.to(familyId).emit('family member deleted', memberId)
      } catch (error) {
        console.error('Error deleting family member:', error)
        socket.emit('delete error', { message: 'Failed to delete family member' })
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}

