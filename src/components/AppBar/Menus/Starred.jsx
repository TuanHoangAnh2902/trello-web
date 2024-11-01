import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import addBoardToRecentViewed from '~/utils/addBoardToRecentViewed'

const cardSx = {
  minWidth: '220px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  mx: 1,
  boxShadow: '0',
  cursor: 'pointer',
  transition: 'all 0.1s linear',
  textDecoration: 'none',
  '&:hover': {
    bgcolor: 'rgba(0, 0, 0, 0.1)',
  },
}

function Starred() {
  const favouriteBoards = useSelector((state) => state.boardsSlice.favouriteBoards)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        sx={{
          color: 'white',
        }}
        id="basic-button-starred"
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Starred
      </Button>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred',
        }}
      >
        {favouriteBoards && favouriteBoards.length > 0 ? (
          favouriteBoards.map((board) => (
            <Card
              key={board._id}
              component={Link}
              to={`/root/boards/${board._id}`}
              onClick={() => {
                addBoardToRecentViewed(board._id)
                handleClose()
              }}
              sx={cardSx}
            >
              <CardMedia
                component="img"
                sx={{ width: 40, height: 32, ml: 1, borderRadius: '2px' }}
                image={board.bgImage}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', m: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 0, mr: 1, '&:last-child': { paddingBottom: 0 } }}>
                  <Typography fontSize={'14px'} lineHeight={'1.2'} component="div" variant="h6">
                    {board.title}
                  </Typography>
                  <Typography fontSize={'12px'} lineHeight={'1.2'} variant="subtitle1" color="text.secondary">
                    {board.description}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          ))
        ) : (
          <Typography align="center" sx={{ minWidth: '200px' }}>
            No thing
          </Typography>
        )}
      </Menu>
    </Box>
  )
}

export default Starred
