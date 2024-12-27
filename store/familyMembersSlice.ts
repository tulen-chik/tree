import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FamilyMember } from '../types/family'

interface FamilyMembersState {
  familyMembers: FamilyMember[]
  selectedMember: FamilyMember | null
}

const initialState: FamilyMembersState = {
  familyMembers: [],
  selectedMember: null,
}

export const familyMembersSlice = createSlice({
  name: 'familyMembers',
  initialState,
  reducers: {
    setFamilyMembers: (state, action: PayloadAction<FamilyMember[]>) => {
      state.familyMembers = action.payload
    },
    addFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      state.familyMembers.push(action.payload)
    },
    updateFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      const index = state.familyMembers.findIndex(member => member.id === action.payload.id)
      if (index !== -1) {
        state.familyMembers[index] = action.payload
      }
    },
    deleteFamilyMember: (state, action: PayloadAction<string>) => {
      state.familyMembers = state.familyMembers.filter(member => member.id !== action.payload)
    },
    setSelectedMember: (state, action: PayloadAction<FamilyMember | null>) => {
      state.selectedMember = action.payload
    },
  },
})

export const {
  setFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  setSelectedMember,
} = familyMembersSlice.actions

export default familyMembersSlice.reducer

