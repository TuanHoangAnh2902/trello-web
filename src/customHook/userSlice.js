import { createSlice } from '@reduxjs/toolkit'

const userslice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { setIsAuthenticated, setUser } = userslice.actions
export default userslice.reducer
