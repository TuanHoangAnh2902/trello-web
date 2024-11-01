import { updateViewedAPI } from '~/apis'

const addBoardToRecentViewed = async (boardId) => {
  await updateViewedAPI(boardId)
}

export default addBoardToRecentViewed
