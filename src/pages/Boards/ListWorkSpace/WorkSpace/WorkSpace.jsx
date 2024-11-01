import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Select from 'react-select'

import { addMemberToWorkSpace, fetchWorkSpacesDetails, getAllUsersAPI } from '~/apis'
import { ReactComponent as LockIcon } from '~/assets/lock.svg'
import BoardWrapper from '~/components/Board/BoardWrapper'
import { setWorkSpaceDetails } from '~/pages/Boards/boardsSlice'

const cardSx = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxShadow: '0',
  cursor: 'pointer',
  transition: 'all 0.1s linear',
  textDecoration: 'none',
  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
  py: 1,
  m: 0.5,
}

function WorkSpace() {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [users, setUsers] = useState([])

  const params = useParams()
  const dispatch = useDispatch()

  const workSpaceDetails = useSelector((state) => state.boardsSlice.workSpaceDetails)
  const allBoards = useSelector((state) => state.boardsSlice.allBoards)

  const workspaceId = params.workspaceId
  const memberId = selectedOption?.label?.props?.children[0]?.key

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setSelectedOption(null)
  }

  const handleUpdateAddMember = async () => {
    return await addMemberToWorkSpace(workspaceId, memberId)
  }

  useEffect(() => {
    const getWorkSpaceDetail = async () => {
      const res = await fetchWorkSpacesDetails(workspaceId)
      dispatch(setWorkSpaceDetails(res))
    }
    getWorkSpaceDetail()
  }, [allBoards, dispatch, workspaceId])

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await getAllUsersAPI()
      if (res) {
        setUsers(res)
      }
    }

    getAllUsers()
  }, [])

  // Kiểm tra xem boards có dữ liệu chưa và tạo options cho react-select
  const options = users?.map((user) => ({
    value: user.email, // Gán giá trị cho option để dễ dàng quản lý
    label: (
      <Card sx={cardSx}>
        <CardMedia
          key={user._id}
          component="img"
          sx={{ width: 30, height: 30, ml: 2, borderRadius: '50%' }}
          image={user.avatar || ''}
          alt={user.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', m: '4px 4px 4px 8px' }}>
          <CardContent sx={{ flex: '1 0 auto', p: 0, '&:last-child': { paddingBottom: 0 } }}>
            <Typography fontSize={'14px'} lineHeight={'1.2'} component="div" variant="body1">
              {user.email}
            </Typography>
            {/* <Typography fontSize={'12px'} lineHeight={'1.2'} variant="subtitle1" color="text.secondary">
              {user.description}
            </Typography> */}
          </CardContent>
        </Box>
      </Card>
    ),
  }))

  return (
    <Box>
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <Box m={6}>
          <Stack sx={{ justifyContent: 'flex-start', flexDirection: 'row', gap: 1 }}>
            <Avatar sx={{ width: '60px', height: '60px' }} variant="rounded" src={workSpaceDetails?.avatar}>
              {workSpaceDetails?.title?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{workSpaceDetails.title}</Typography>
              <Stack direction={'row'} alignItems={'center'} gap={'3px'}>
                <SvgIcon fontSize="" inheritViewBox component={LockIcon} sx={{ fontSize: '15px' }} />
                <Typography>{workSpaceDetails.type}</Typography>
              </Stack>
            </Box>
          </Stack>
          <Typography color="#44546f" variant="inherit" fontSize={12} maxWidth={400}>
            {workSpaceDetails.description}
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" startIcon={<GroupAddIcon />} onClick={handleClickOpen}>
            Invite members to the workspace
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Invite to work space</DialogTitle>
            <DialogContent>
              <Box
                sx={{ minWidth: '400px' }}
                component={Select}
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  option: (base) => ({
                    ...base,
                    height: '100%',
                    padding: 0,
                    '&:hover': { background: 'none', color: 'none', padding: 0 },
                  }),
                }}
                placeholder="Email address"
                isClearable
                required
                autoFocus
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleUpdateAddMember}>
                Invite
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Stack>
      <Divider />
      <Stack mt={2.5} ml={2} direction={'row'} gap={1}>
        <PersonOutlineIcon />
        <Typography fontSize={17} fontWeight={700} variant="inherit">
          Your Boards
        </Typography>
      </Stack>
      <Box m={1}>
        <BoardWrapper data={workSpaceDetails.boards} />
      </Box>
    </Box>
  )
}

export default WorkSpace
