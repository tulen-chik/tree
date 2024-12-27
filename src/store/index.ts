import { configureStore } from '@reduxjs/toolkit'
import familiesReducer from './familiesSlice'
import familyMembersReducer from './familyMembersSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    families: familiesReducer,
    familyMembers: familyMembersReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

