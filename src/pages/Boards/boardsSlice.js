import { createSlice } from '@reduxjs/toolkit'

const boardsSlice = createSlice({
  name: 'boardsSlice',
  initialState: {
    workSpaceDetails: {},
    favouriteBoards: [],
    recentlyBoards: [],
    workspaces: [],
    allBoards: [],
    board: [],
  },
  reducers: {
    setAllBoards: (state, action) => {
      state.allBoards = action.payload
    },
    setRecentlyBoards: (state, action) => {
      state.recentlyBoards = action.payload
    },
    setFavouriteBoards: (state, action) => {
      state.favouriteBoards = action.payload
    },

    addFavouriteBoards: (state, action) => {
      const { _id, favourite } = action.payload

      if (!favourite) {
        // Lọc ra bảng từ danh sách favouriteBoards
        state.favouriteBoards = state.favouriteBoards.filter((board) => board._id !== _id)
      } else {
        // Cập nhật bảng trong allBoards
        const favouriteBoardIndex = state.allBoards.findIndex((item) => item._id === _id)

        if (favouriteBoardIndex !== -1) {
          state.allBoards[favouriteBoardIndex] = action.payload
          // Cập nhật bảng yêu thích trong allBoards
        } else {
          // Nếu bảng không có trong allBoards, có thể xử lý nếu cần
          state.allBoards.push(action.payload)
        }

        // Kiểm tra xem bảng đã có trong favouriteBoards chưa
        const existingBoard = state.favouriteBoards.find((board) => board._id === _id)

        // Nếu bảng chưa có, thêm nó vào favouriteBoards
        if (!existingBoard) {
          state.favouriteBoards.push(action.payload)
        }
      }
    },

    setBoard: (state, action) => {
      state.board = action.payload
    },
    addBoard: (state, action) => {
      state.board?.push(action.payload)
    },
    setWorkSpaces: (state, action) => {
      state.workspaces = action.payload
    },
    setWorkSpaceDetails: (state, action) => {
      state.workSpaceDetails = action.payload
    },
    addWorkSpace: (state, action) => {
      state.workspaces?.push(action.payload)
    },
  },
})

export const {
  setWorkSpaceDetails,
  addFavouriteBoards,
  setFavouriteBoards,
  setRecentlyBoards,
  setWorkSpaces,
  addWorkSpace,
  setAllBoards,
  setBoard,
  addBoard,
} = boardsSlice.actions
export default boardsSlice.reducer
