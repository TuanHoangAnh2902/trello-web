import cloundinaryAxios from '~/apis/axiosCloudinaryConfig'
import axios from '~/apis/axiosConfig'
// import { API_ROOT } from '~/utils/constants';

/** workspace */
export const fetchFullWorkSpacesAPI = async (userId) => {
  const res = await axios.get(`/v1/workspaces/u/${userId}`)
  return res
}

export const fetchFullWorkSpacesDetailsAPI = async (userId) => {
  const res = await axios.get(`/v1/workspaces/all/${userId}`)
  return res
}

export const fetchWorkSpacesDetails = async (workspaceId) => {
  const res = await axios.get(`/v1/workspaces/${workspaceId}`)
  return res
}

export const addMemberToWorkSpace = async (workSpaceId, memberId) => {
  return await axios.put(`/v1/workspaces/${workSpaceId}`, { memberId })
}

export const addWorkSpaceAPI = async (workSpaceData) => {
  return await axios.post('/v1/workspaces', workSpaceData)
}

/** Board */
export const createNewBoardAPI = async (data) => {
  const res = await axios.post('/v1/boards', data)
  return res
}

export const addFavouriteAPI = async (data) => {
  const res = await axios.put('/v1/boards/favourite', data)
  return res
}

export const fetchFullBoardAPI = async (userId) => {
  const res = await axios.get(`/v1/boards/all/${userId}`)
  return res
}

export const fetchBoardDetailsAPI = async (boardId) => {
  const res = await axios.get(`/v1/boards/${boardId}`)
  return res
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const res = await axios.put(`/v1/boards/${boardId}`, updateData)
  return res
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const res = await axios.post('/v1/columns', newColumnData)
  return res
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const res = await axios.put('/v1/boards/supports/moving_card', updateData)
  return res
}

export const updateColumnDetailsAPI = async (ColumnId, updateData) => {
  const res = await axios.put(`/v1/columns/${ColumnId}`, updateData)
  return res
}

export const deleteColumnDetailsAPI = async (ColumnId) => {
  const res = await axios.delete(`/v1/columns/${ColumnId}`)
  return res
}

/** Card */
export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post('/v1/cards', newCardData)
  return res
}

/** Login */
export const loginAPI = async (loginData) => {
  const res = await axios.post('/v1/auth/login', loginData)
  return res
}

/** Logout */
export const logoutAPI = async () => {
  const res = await axios.post('/v1/auth/logout')
  return res
}
/** Register */
export const registerAPI = async (registerData) => {
  const res = await axios.post('/v1/auth/register', registerData)
  return res
}

export const checkAuthAPI = async () => {
  const res = await axios.get('/v1/auth/check')
  return res
}

/** upload images */
export const uploadAvatarAPI = async (avatar) => {
  const data = new FormData()
  data.append('file', avatar)
  data.append('upload_preset', 'upload-preset')

  const res = await cloundinaryAxios.post('/image/upload', data)
  return res
}

/**recent viewed */
export const recentViewedAPI = async (dataId) => {
  const res = await axios.post('/v1/viewed', dataId)
  return res
}

export const getRecentViewedAPI = async (userId) => {
  const res = await axios.get(`/v1/viewed/${userId}`)
  return res
}

export const updateViewedAPI = async (boardId) => {
  const res = await axios.put(`/v1/boards/recently/${boardId}`)
  return res
}

/** User */
export const getAllUsersAPI = async () => {
  const res = await axios.get('/v1/users')
  return res
}
