// redux: state management tool
// redux-thunk: middleware for handling async actions

import { configureStore } from '@reduxjs/toolkit'
import userSlice from '~/customHook/userSlice'
import boardsSlice from '~/pages/Boards/boardsSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    boardsSlice: boardsSlice,
  },
})

export default store
