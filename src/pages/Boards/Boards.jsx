import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

import { toast } from 'react-toastify'
import { addWorkSpaceAPI, fetchFullWorkSpacesDetailsAPI, uploadAvatarAPI } from '~/apis'
import { ReactComponent as HomeIcon } from '~/assets/home.svg'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as TrelloSubIcon } from '~/assets/trello_sub.svg'
import { addWorkSpace, setWorkSpaces } from './boardsSlice'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const Img = styled('img')({
  maxWidth: 150,
})

function Boards() {
  const [view, setView] = useState('list')
  const [open, setOpen] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [type, setType] = useState('public')
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const workspaces = useSelector((state) => state.boardsSlice.workspaces)
  const user = useSelector((state) => state.user.user)
  const userId = user?._id

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    if (!openDialog) setPreviewImage(null)
  }, [openDialog])

  const handleUploadAvatar = async () => {
    setIsLoading(true)
    try {
      const resCloud = await uploadAvatarAPI(image)
      const avatarUrl = resCloud.secure_url
      setIsLoading(false)
      return avatarUrl
    } catch (error) {
      setIsLoading(false)
      toast.error('Failed to upload avatar', { position: 'top-right' })
      throw error
    }
  }

  const handleAddWorkSpace = async (data) => {
    try {
      setIsLoading(true)
      const avartarUrl = await handleUploadAvatar(image)
      if (!avartarUrl) throw new Error('Failed to upload avatar')

      const workSpaceData = {
        ...data,
        avatar: avartarUrl,
      }

      const result = await addWorkSpaceAPI(workSpaceData)
      dispatch(addWorkSpace(result?.createdWorkSpace))

      // Optional: Show success toast or update UI
      toast.success('Workspace added successfully!')
      setIsLoading(false)
    } catch (error) {
      toast.error('Error adding workspace, try again later.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return

      try {
        const res = await fetchFullWorkSpacesDetailsAPI(userId)

        if (res) {
          dispatch(setWorkSpaces(res))
        }
      } catch (error) {
        // console.error("Error fetching workspaces details:", error);
      }
    }

    fetchData()
  }, [dispatch, userId])

  const handleClick = (key) => {
    setOpen((prevState) => ({
      ...prevState,
      [key]: Boolean(!prevState[key]),
    }))
  }

  const handleChange = (event, nextView) => {
    setView(nextView)
  }

  const handleChangeSelect = (event) => {
    setType(event.target.value)
  }

  const handleSetImage = (e) => {
    setImage(e)
    const urlImage = URL.createObjectURL(e)
    setPreviewImage(urlImage)
  }

  const toggleButtonSx = {
    border: 'none',
    textTransform: 'none',
    gap: 0.8,
    justifyContent: 'flex-start',
    borderRadius: '10px !important',
    height: '36px',
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        mt: 4,
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight}px)`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1d2125' : 'transparent'),
      }}
    >
      <Container disableGutters maxWidth={'lg'}>
        <Grid container spacing={4}>
          <Grid item lg={3}>
            <ToggleButtonGroup
              sx={{ gap: 1, my: 1 }}
              orientation="vertical"
              value={view}
              exclusive
              onChange={handleChange}
              fullWidth
            >
              <ToggleButton
                color="primary"
                component={Link}
                to={'list-workspaces'}
                fullWidth
                sx={toggleButtonSx}
                value="list"
              >
                <SvgIcon fontSize="" component={TrelloIcon} inheritViewBox />
                Board
              </ToggleButton>
              <ToggleButton
                color="primary"
                component={Link}
                to={'template'}
                fullWidth
                sx={toggleButtonSx}
                value="module"
              >
                <SvgIcon fontSize="" component={TrelloSubIcon} inheritViewBox />
                Template
              </ToggleButton>
              <ToggleButton color="primary" component={Link} to={'home'} fullWidth sx={toggleButtonSx} value="quit">
                <SvgIcon fontSize="" component={HomeIcon} inheritViewBox />
                Home Page
              </ToggleButton>
            </ToggleButtonGroup>
            <Divider />
            <Typography margin={1}>Workspaces</Typography>
            <Box sx={{ my: 1 }}>
              {workspaces &&
                workspaces.length > 0 &&
                workspaces?.map((workspace, index) => (
                  <List
                    key={workspace?._id}
                    sx={{ width: '100%', maxWidth: 360 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    <ToggleButton
                      selected={open[index] ? true : false}
                      onClick={() => handleClick(index)}
                      sx={toggleButtonSx}
                      value={index}
                      fullWidth
                    >
                      <Avatar src={workspace?.avatar} sx={{ width: '26px', height: '26px' }} variant="rounded">
                        <Typography variant="h6" sx={{ fontSize: '16px' }}>
                          {workspace.title.charAt(0)}
                        </Typography>
                      </Avatar>
                      <Typography sx={{ mr: 'auto' }}>{workspace.title}</Typography>
                      {open[index] ? <ExpandLess /> : <ExpandMore />}
                    </ToggleButton>
                    <Collapse in={open[index]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ToggleButtonGroup
                          sx={{ gap: 1, my: 1, pl: '20px' }}
                          orientation="vertical"
                          value={view}
                          exclusive
                          onChange={handleChange}
                          fullWidth
                        >
                          <ToggleButton
                            component={Link}
                            to={`${workspace?._id}`}
                            state={{ workspace }}
                            color="primary"
                            fullWidth
                            sx={toggleButtonSx}
                            value={`${workspace?._id} - 1`}
                          >
                            <SvgIcon fontSize="" component={TrelloIcon} inheritViewBox />
                            Board
                          </ToggleButton>
                          {/* <ToggleButton color="primary" fullWidth sx={toggleButtonSx} value={`${workspace?._id} - 2`}>
                            <SvgIcon fontSize="" component={HomeIcon} inheritViewBox />
                            Template
                          </ToggleButton> */}
                          <ToggleButton color="primary" fullWidth sx={toggleButtonSx} value={`${workspace?._id} - 3`}>
                            <SvgIcon fontSize="" component={HomeIcon} inheritViewBox />
                            Home Page
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </List>
                    </Collapse>
                  </List>
                ))}
            </Box>
            <LoadingButton
              sx={{
                boxShadow: '0 5px 0 0 #888888',
                transition: 'all 0.09s ease-in-out',
                '&:active': { transform: ' translateY(5px)', boxShadow: '0 0px 0 0 #888888' },
              }}
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              loading={isLoading}
            >
              Add workspace
            </LoadingButton>
            <Dialog
              fullWidth
              maxWidth={'sm'}
              open={openDialog}
              onClose={handleClose}
              PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  formData.append('userId', userId)
                  const formJson = Object.fromEntries(formData.entries())
                  handleAddWorkSpace(formJson)
                  handleClose()
                },
              }}
            >
              <DialogTitle>Add workspace</DialogTitle>
              <DialogContent>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      name="title"
                      label="Title"
                      type="title"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl margin="dense" fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-standard-label">Type *</InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={type}
                        onChange={handleChangeSelect}
                        label="Type"
                        name="type"
                        type="type"
                      >
                        <MenuItem value={'public'}>Public</MenuItem>
                        <MenuItem value={'private'}>Private</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="description"
                  label="Description"
                  type="description"
                  fullWidth
                  variant="outlined"
                />
                <Button sx={{ mt: 1 }} component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Upload Your Image
                  <VisuallyHiddenInput type="file" onChange={(e) => handleSetImage(e.target.files[0])} />
                </Button>
                {previewImage ? (
                  <Stack my={2} alignItems={'center'} justifyContent={'center'}>
                    <Img src={previewImage} />
                  </Stack>
                ) : (
                  ''
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" variant="outlined">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid
            item
            lg={9}
            sx={{ overflow: 'scroll', height: (theme) => `calc(100vh - ${theme.trello.appBarHeight}px)` }}
          >
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}

export default Boards
