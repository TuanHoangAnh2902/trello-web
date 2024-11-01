import Container from '@mui/material/Container'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { setBoard } from './boardsSlice'

function Board() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const param = useParams()
  const dispatch = useDispatch()
  const board = useSelector((state) => state.boardsSlice.board)

  useEffect(() => {
    const loadBoardData = async () => {
      setIsLoading(true) // Bắt đầu loading mỗi khi boardId thay đổi

      try {
        const board = await fetchBoardDetailsAPI(param.boardId)

        // Sắp xếp các cột theo `columnOrderIds`
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

        board.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            // Thêm placeholder nếu cột không có card
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [column.cards[0]._id]
          } else {
            // Sắp xếp các card theo `cardOrderIds`
            column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
          }
        })

        dispatch(setBoard(board))

        setIsLoading(false) // Kết thúc loading khi dữ liệu được tải
      } catch (error) {
        navigate('/user/login') // Redirect nếu xảy ra lỗi
      }
    }

    loadBoardData()

    // Cleanup: Dọn dẹp board khi unmount hoặc thay đổi boardId
    return () => {
      dispatch(setBoard(null)) // Reset board về null để dọn dẹp dữ liệu cũ
      setIsLoading(true) // Đặt loading khi unmount
    }
  }, [dispatch, navigate, param.boardId])

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight})`,
        backgroundImage: `url(${board?.bgImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        objectFit: 'cover',
      }}
    >
      <BoardBar isLoading={isLoading} />
      <BoardContent isLoading={isLoading} />
    </Container>
  )
}

export default Board
