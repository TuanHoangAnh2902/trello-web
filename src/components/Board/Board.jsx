import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { addFavouriteAPI } from '~/apis'
import { ReactComponent as StarIcon } from '~/assets/star.svg'
import { addFavouriteBoards } from '~/pages/Boards/boardsSlice'
import addBoardToRecentViewed from '~/utils/addBoardToRecentViewed'

const Board = ({ board }) => {
  const dispatch = useDispatch()

  // State local để cập nhật UI tức thì khi người dùng click
  const [isFavourite, setIsFavourite] = useState(board.favourite)

  const handleAddFavourite = useCallback(
    async (event, boardId) => {
      const newFavourite = event.target.checked

      setIsFavourite(newFavourite)
      const data = { boardId, favourite: newFavourite }
      try {
        const res = await addFavouriteAPI(data)
        dispatch(addFavouriteBoards(res)) // Cập nhật lại Redux store
      } catch (error) {
        // Nếu API thất bại, khôi phục lại trạng thái ban đầu
        setIsFavourite(!newFavourite)
      }
    },
    [dispatch]
  )

  const typographySx = { fontSize: 14, fontWeight: '600', color: '#fff' }
  const cardSx = {
    maxWidth: '180px',
    minWidth: '180px',
    minHeight: '90px',
    cursor: 'pointer',
    textDecoration: 'none',
    backgroundSize: 'cover',
    position: 'relative',
    '&:hover': {
      bgcolor: (theme) => (theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : '#7f8c8d'),
      filter: 'brightness(80%)',
    },
  }
  const stackSx = {
    overflow: 'hidden',
    position: 'relative',
    '& .rating': {
      position: 'absolute',
      right: '-30px',
      bottom: '2px',
      zIndex: '20',
      transition: 'all 0.1s ease-in-out',
      '&:hover': {
        transform: 'scale(1.2)',
      },
    },
    '&:hover': { filter: 'brightness(80%)', '& .rating': { right: '2px' } },
  }

  return (
    <>
      {board && (
        <Stack key={board._id} sx={stackSx}>
          <Card
            sx={{ ...cardSx, backgroundImage: `url(${board.bgImage})` }}
            component={Link}
            to={`/root/boards/${board._id}`}
            onClick={() => addBoardToRecentViewed(board._id)}
          >
            <CardContent>
              <Typography sx={typographySx} color="text.primary" gutterBottom>
                {board.title}
              </Typography>
            </CardContent>
          </Card>
          <Checkbox
            className="rating"
            checked={Boolean(isFavourite)}
            onChange={(event) => handleAddFavourite(event, board._id)}
            icon={<SvgIcon component={StarIcon} inheritViewBox sx={{ width: '16px', color: '#fff', fill: 'none' }} />}
            checkedIcon={
              <SvgIcon component={StarIcon} inheritViewBox sx={{ width: '16px', color: 'yellow', fill: 'yellow' }} />
            }
          />
        </Stack>
      )}
    </>
  )
}

export default Board
