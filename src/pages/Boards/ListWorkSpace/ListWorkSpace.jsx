import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'

import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchFullBoardAPI } from '~/apis'
import { ReactComponent as Star2Icon } from '~/assets/star_2.svg'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import BoardWrapper from '~/components/Board/BoardWrapper'
import { setAllBoards, setFavouriteBoards, setRecentlyBoards } from '~/pages/Boards/boardsSlice'

function ListWorkSpace() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const allBoards = useSelector((state) => state.boardsSlice.allBoards)
  const workspaces = useSelector((state) => state.boardsSlice.workspaces)
  const recentlyBoards = useSelector((state) => state.boardsSlice.recentlyBoards)
  const favouriteBoards = useSelector((state) => state.boardsSlice.favouriteBoards)
  const user = useSelector((state) => state.user.user)
  const userId = user?._id

  useEffect(() => {
    const getRecentlyBoards = async () => {
      if (!userId) return

      setLoading(true)
      try {
        const result = await fetchFullBoardAPI(userId)
        dispatch(setAllBoards(result))
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    getRecentlyBoards()
    return () => setLoading(false)
  }, [dispatch, userId])

  useEffect(() => {
    if (allBoards && allBoards.length > 0) {
      const recentlyBoards = allBoards.filter((board) => board.viewedAt != null)
      const sortedRecentlyBoards = _.sortBy(recentlyBoards, ['viewedAt']).reverse()
      const limitRecentlyBoards = sortedRecentlyBoards.slice(0, 4)
      dispatch(setRecentlyBoards(limitRecentlyBoards))
    }
  }, [allBoards, dispatch])

  useEffect(() => {
    if (allBoards && allBoards.length > 0) {
      const favouriteBoards = allBoards.filter((board) => board.favourite)
      dispatch(setFavouriteBoards(favouriteBoards))
    }
  }, [allBoards, dispatch])

  return (
    <Box m={1}>
      {favouriteBoards.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Stack sx={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', gap: 1, mb: 2 }}>
            <SvgIcon sx={{ fill: 'none' }} fontSize="medium" component={Star2Icon} inheritViewBox />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: '600' }}>
              Star board
            </Typography>
          </Stack>
          <BoardWrapper data={favouriteBoards} loading={loading} />
        </Box>
      )}

      {recentlyBoards.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Stack sx={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', gap: 1, mb: 2 }}>
            <AccessTimeIcon />
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: '600' }}>
              Recently viewed
            </Typography>
          </Stack>
          <BoardWrapper data={recentlyBoards} loading={loading} />
        </Box>
      )}

      <Box>
        <Typography textTransform={'uppercase'} fontWeight={'700'} variant="h6" fontSize={17}>
          Your Workspaces
        </Typography>
        {workspaces && workspaces.length > 0 ? (
          workspaces?.map((workspace, index) => (
            <Box key={workspace._id} mt={index === 0 ? 2 : 7}>
              <Stack sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
                  <Avatar sx={{ width: '32px', height: '32px' }} variant="rounded" src={workspace?.avatar}>
                    {workspace?.title?.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: '700' }}>
                    {workspace.title}
                  </Typography>
                </Stack>
                <Stack sx={{ justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
                  <Chip icon={<TrelloIcon />} label="Board" sx={{ borderRadius: '4px' }} clickable />
                  <Chip
                    icon={<PeopleIcon sx={{ fontSize: '16px' }} />}
                    label={`Members (${workspace?.members?.length})`}
                    sx={{ borderRadius: '4px' }}
                    clickable
                  />
                </Stack>
              </Stack>
              <BoardWrapper data={workspace.boards} loading={loading} />
            </Box>
          ))
        ) : (
          <Typography>You do not have a workspace yet</Typography>
        )}
      </Box>
    </Box>
  )
}

export default ListWorkSpace
