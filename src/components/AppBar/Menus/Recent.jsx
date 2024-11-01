import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import addBoardToRecentViewed from '~/utils/addBoardToRecentViewed'

function Recent() {
  const recentlyBoards = useSelector((state) => state.boardsSlice.recentlyBoards)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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

  return (
    <Box>
      <Button
        sx={{
          color: 'white',
        }}
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Recent
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent',
        }}
      >
        {recentlyBoards.length > 0 ? (
          recentlyBoards?.map((recentlyBoard) => (
            <Card
              component={Link}
              to={`/root/boards/${recentlyBoard._id}`}
              onClick={() => {
                addBoardToRecentViewed(recentlyBoard._id)
                handleClose()
              }}
              key={recentlyBoard._id}
              sx={cardSx}
            >
              <CardMedia
                component="img"
                sx={{ width: 40, height: 32, ml: 1, borderRadius: '2px' }}
                image={recentlyBoard.bgImage}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', m: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 0, mr: 1, '&:last-child': { paddingBottom: 0 } }}>
                  <Typography fontSize={'14px'} lineHeight={'1.2'} component="div" variant="h6">
                    {recentlyBoard.title}
                  </Typography>
                  <Typography fontSize={'12px'} lineHeight={'1.2'} variant="subtitle1" color="text.secondary">
                    {recentlyBoard.description}
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

export default Recent
