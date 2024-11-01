import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Menu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Workspaces() {
  const workspaces = useSelector((state) => state.boardsSlice.workspaces)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const cardSx = {
    minHeight: '50px',
    minWidth: '220px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    mx: 1.5,
    boxShadow: '0',
    cursor: 'pointer',
    transition: 'all 0.1s linear',
    textDecoration: 'none',
    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces',
        }}
      >
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <Card
              onClick={handleClose}
              component={Link}
              // to={`/root/boards/${recentlyBoard._id}`}
              key={workspace._id}
              sx={cardSx}
            >
              <CardMedia
                component="img"
                sx={{ width: 40, height: 40, ml: 1, borderRadius: '4px' }}
                image={workspace.avatar}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', m: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 0, mr: 1, '&:last-child': { paddingBottom: 0 } }}>
                  <Typography fontSize={'14px'} lineHeight={'1.2'} component="div" variant="h6">
                    {workspace.title}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          ))
        ) : (
          <Typography align="center" sx={{ mx: 2 }}>
            You do not have a workspace yet
          </Typography>
        )}
      </Menu>
    </Box>
  )
}

export default Workspaces
