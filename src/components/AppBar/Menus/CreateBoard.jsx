import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { LoadingButton } from '@mui/lab'
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'

import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { createNewBoardAPI, fetchFullWorkSpacesAPI } from '~/apis'
import { ReactComponent as PrevireBgIcon } from '~/assets/preview-bg.svg'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { addBoard, setWorkSpaces } from '~/pages/Boards/boardsSlice'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1556379092-dca659792591?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Image 1',
  },
  {
    src: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-285904-842711.jpg&fm=jpg',
    alt: 'Image 2',
  },
  { src: 'https://images3.alphacoders.com/135/1350069.jpeg', alt: 'Image 3' },
  {
    src: 'https://asset.gecdesigns.com/img/wallpapers/beautiful-fantasy-wallpaper-ultra-hd-wallpaper-4k-sr10012418-1706506236698-cover.webp',
    alt: 'Image 4',
  },
]

const CreateBoard = () => {
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentMenu, setCurrentMenu] = useState('main')
  const [previousMenu, setPreviousMenu] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [allWorkSpaces, setAllWorkSpaces] = useState([])
  const [boardData, setBoardData] = useState({
    bgImage: images[selectedImage].src,
    title: '',
    type: 'private',
    description: '',
    workSpaceId: '',
    userId: '',
  })

  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user?.user?._id)
  const workspaces = useSelector((state) => state.boardsSlice.workspaces)

  useEffect(() => {
    const getFullWorkSpace = async () => {
      if (!userId) return // Kiểm tra nếu không có userId thì không gọi API
      try {
        const res = await fetchFullWorkSpacesAPI(userId)
        setAllWorkSpaces(res)
        if (userId) setBoardData((prev) => ({ ...prev, userId: userId }))
        if (res.length > 0) {
          setBoardData((prev) => ({ ...prev, workSpaceId: res[0]?._id }))
        }
      } catch (error) {
        toast.error('Failed to load workspaces')
      }
    }

    getFullWorkSpace()
  }, [userId])

  const handleCreateBoard = async () => {
    try {
      setLoading(true)
      const res = await createNewBoardAPI(boardData)

      if (res.status === 201) {
        const data = res.createdBoard
        dispatch(addBoard(data))

        const newWorkSpace = cloneDeep(workspaces)
        const workSpaceToUpdate = newWorkSpace.find((workSpace) => workSpace._id === data.workSpaceId)

        workSpaceToUpdate?.boards?.push(data)

        dispatch(setWorkSpaces(newWorkSpace))

        toast.success(res.message, { position: 'top-right' })
      } else {
        toast.error('Failed to create board', { position: 'top-right' })
      }
      closeMenu()
    } catch (error) {
      toast.error(error.message || 'An error occurred', { position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = (event) => {
    setBoardData((prev) => ({ ...prev, type: event.target.value }))
  }
  const handleChangeTitle = (event) => {
    setBoardData((prev) => ({ ...prev, title: event.target.value }))
  }
  const handleChangeDescription = (event) => {
    setBoardData((prev) => ({ ...prev, description: event.target.value }))
  }

  const handleChangeWorkSpaceId = (event) => {
    setBoardData((prev) => ({ ...prev, workSpaceId: event.target.value }))
  }

  const handleSelect = (index) => {
    setSelectedImage(index)
    setBoardData((prev) => ({
      ...prev,
      bgImage: images[index].src,
    }))
  }

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setCurrentMenu('main')
    setBoardData((prev) => ({
      ...prev,
      bgImage: images[selectedImage].src,
      title: '',
      type: 'private',
      description: '',
    }))
  }

  const handleMenuClick = (menu) => {
    setPreviousMenu(currentMenu) // Lưu lại menu hiện tại
    setCurrentMenu(menu)
  }

  const handleBack = () => {
    setCurrentMenu(previousMenu) // Quay lại menu trước đó
    setBoardData((prev) => ({
      ...prev,
      bgImage: images[selectedImage].src,
      title: '',
      type: 'private',
      description: '',
    }))
  }

  const toggleButtonSx = {
    border: 'none',
    textTransform: 'none',
    gap: 0.8,
    justifyContent: 'flex-start',
    borderRadius: '10px !important',
    py: 0,
  }

  const renderMenuContent = () => {
    if (currentMenu === 'main') {
      return [
        <MenuItem key="menu1" onClick={() => handleMenuClick('submenu1')}>
          <Button fullWidth sx={toggleButtonSx} value="list">
            <SvgIcon fontSize="" component={TrelloIcon} inheritViewBox />
            Board
          </Button>
        </MenuItem>,
        <MenuItem key="menu2" onClick={() => handleMenuClick('submenu2')}>
          <Button fullWidth sx={toggleButtonSx} value="list">
            <SvgIcon fontSize="" component={TrelloIcon} inheritViewBox />
            Start with samples
          </Button>
        </MenuItem>,
      ]
    }

    if (currentMenu === 'submenu1') {
      return [
        <Stack
          key="submenu1_item3"
          sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, mx: 1 }}
        >
          <IconButton
            size="small"
            onClick={handleBack}
            sx={{ '&:hover': { borderRadius: '8px', background: 'rgb(0 0 0 / 10%)' } }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography>Create Board</Typography>
          <IconButton
            size="small"
            onClick={closeMenu}
            sx={{ '&:hover': { borderRadius: '8px', background: 'rgb(0 0 0 / 10%)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>,
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={'submenu1_item1'}
        >
          <Paper elevation={3} sx={{ backgroundImage: `url(${images[selectedImage]?.src})`, backgroundSize: 'cover' }}>
            <SvgIcon
              sx={{ fontSize: '200px', with: '186px', height: '103px', mt: 0.5 }}
              inheritViewBox
              component={PrevireBgIcon}
            />
          </Paper>
        </Stack>,
        <Box key={'submenu1_item2'} sx={{ p: 2 }}>
          <Typography variant="h6" fontSize={'0.8rem'} fontWeight={'700'}>
            Background
          </Typography>
          <Grid container spacing={1}>
            {images.map((image, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  onClick={() => handleSelect(index)}
                  sx={{
                    borderRadius: 1,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image.src}
                    alt={image.alt}
                    sx={{
                      height: 50,
                      objectFit: 'cover',
                      filter: selectedImage === index ? 'brightness(80%)' : 'transparent',
                    }}
                  />
                  {selectedImage === index && (
                    <CheckIcon
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '30%',
                        transform: 'translate(-50% , -50%)',
                        color: '#fff',
                        fontSize: '1rem',
                        textAlign: 'center',
                      }}
                    />
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6} mt={2}>
              <Typography variant="h6" fontSize={'0.8rem'} fontWeight={'700'}>
                Title
              </Typography>
              <TextField
                onChange={handleChangeTitle}
                value={boardData.title}
                fullWidth
                size="small"
                id="outlined-basic"
                variant="outlined"
                autoFocus
                error={!boardData.title}
                helperText={!boardData.title ? 'This field is required' : ''}
              />
            </Grid>
            <Grid item xs={6} mt={2}>
              <Typography variant="h6" fontSize={'0.8rem'} fontWeight={'700'}>
                Role
              </Typography>
              <FormControl fullWidth error={!boardData.type}>
                <Select size="small" id="demo-simple-select" value={boardData.type} onChange={handleChangeRole}>
                  <MenuItem value={'public'}>public</MenuItem>
                  <MenuItem value={'private'}>private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6} mt={2}>
              <Typography variant="h6" fontSize={'0.8rem'} fontWeight={'700'}>
                Description
              </Typography>
              <TextField
                onChange={handleChangeDescription}
                value={boardData.description}
                fullWidth
                size="small"
                id="outlined-basic"
                variant="outlined"
                error={!boardData.description}
                helperText={!boardData.description ? 'This field is required' : ''}
              />
            </Grid>
            <Grid item xs={6} mt={2}>
              <Typography variant="h6" fontSize={'0.8rem'} fontWeight={'700'}>
                WorkSpace
              </Typography>
              <FormControl fullWidth error={allWorkSpaces.length === 0}>
                <Select
                  size="small"
                  fullWidth
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={boardData.workSpaceId}
                  onChange={handleChangeWorkSpaceId}
                >
                  {allWorkSpaces &&
                    allWorkSpaces.map((workSpaces) => (
                      <MenuItem key={workSpaces?._id} value={workSpaces?._id}>
                        {workSpaces.title}
                      </MenuItem>
                    ))}
                </Select>
                {allWorkSpaces.length === 0 && <FormHelperText>You must have a workspace</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            onClick={handleCreateBoard}
            disabled={boardData.title && boardData.description && boardData.type ? false : true}
            sx={{ mt: 1 }}
            variant="contained"
            fullWidth
          >
            Create
          </LoadingButton>
        </Box>,
      ]
    }

    if (currentMenu === 'submenu2') {
      return [
        <MenuItem key="back" onClick={handleBack}>
          <IconButton size="small">
            <ArrowBackIcon />
          </IconButton>
        </MenuItem>,
        <MenuItem key="submenu2_item1">Submenu 2 Item 1</MenuItem>,
        <MenuItem key="submenu2_item2">Submenu 2 Item 2</MenuItem>,
      ]
    }

    return null
  }

  return (
    <>
      <Button
        sx={{ color: 'white', '&:hover': { borderColor: 'white' } }}
        startIcon={<LibraryAddIcon />}
        variant="contained"
        onClick={openMenu}
      >
        Create
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {renderMenuContent()}
      </Menu>
    </>
  )
}

export default CreateBoard
