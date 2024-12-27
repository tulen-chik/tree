import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Family } from '@/types/family'

interface FamiliesState {
  families: Family[]
  selectedFamily: Family | null
}

const initialState: FamiliesState = {
  families: [],
  selectedFamily: null,
}

export const familiesSlice = createSlice({
  name: 'families',
  initialState,
  reducers: {
    setFamilies: (state, action: PayloadAction<Family[]>) => {
      state.families = action.payload
    },
    addFamily: (state, action: PayloadAction<Family>) => {
      state.families.push(action.payload)
    },
    setSelectedFamily: (state, action: PayloadAction<Family | null>) => {
      state.selectedFamily = action.payload
    },
  },
})

export const { setFamilies, addFamily, setSelectedFamily } = familiesSlice.actions

export default familiesSlice.reducer

