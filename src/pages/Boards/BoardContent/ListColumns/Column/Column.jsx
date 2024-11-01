import { useState } from 'react'

import AddCardIcon from '@mui/icons-material/AddCard'
import CloseIcon from '@mui/icons-material/Close'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

import { Skeleton } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { createNewCardAPI, deleteColumnDetailsAPI } from '~/apis'
import { setBoard } from '~/pages/Boards/boardsSlice'
import ListCards from './ListCards/ListCards'

function Column({ column, isLoading }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const dispatch = useDispatch()
  const board = useSelector((state) => state.boardsSlice.board)

  const open = Boolean(anchorEl)

  const toggleNewCardForm = () => {
    setNewCardTitle('')
    setOpenNewCardForm((prev) => !prev)
  }

  const addNewCard = () => {
    if (!newCardTitle || newCardTitle.trim().length < 3) {
      toast.error('title phải có độ dài hơn 3 ký tự', {
        position: 'bottom-right',
      })
      return
    }
    // tạo dữ liệu card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    }
    createNewCard(newCardData)
    // gọi API tạo mới column
    setNewCardTitle('')
    setOpenNewCardForm((prev) => !prev)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // nếu column rỗng (chứa placeholder-card)
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }

    dispatch(setBoard(newBoard))
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: {
      ...column,
    },
  })

  const dndKitColumnStyles = {
    // touchAction: 'none', // dành cho sensor default dạng pointerSensor
    /** dùng CSS.Transform sẽ bị lỗi kiểu strech */
    transform: CSS.Translate.toString(transform),
    transition,

    /** chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua 1 column dài. Để {...attributes} ở Box bên trong để tránh tình trạng kéo ở ngoài card vẫn bị dính */
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  const orderedCards = column.cards

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // xóa 1 column và card bên trong
  const deleteColumnDetails = (columnId) => {
    // update state phía client
    const newBoard = cloneDeep(board)
    newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
    dispatch(setBoard(newBoard))
    //gọi API
    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  // xử lý xóa column và các card trong column
  const confirm = useConfirm()
  const handleDeleteColumn = () => {
    confirm({
      title: 'Delete Column',
      description: 'This action will permanently delete your Column and its Cards! are you sure?',
      confirmationText: 'Confirm',
      confirmationButtonProps: { color: 'error', variant: 'contained' },
    })
      .then(() => {
        deleteColumnDetails(column._id)
      })
      .catch(() => {})
  }
  let CustomSkeleton = Skeleton
  isLoading ? (CustomSkeleton = Skeleton) : (CustomSkeleton = Box)

  // bọc 1 thẻ div ở ngoài để tránh bug giật giật khi kéo columns
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <CustomSkeleton
        {...listeners}
        sx={{
          minWidth: 300,
          maxWidth: 300,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/*Box Column Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {column.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-card-icon': { color: 'primary.main' },
                  },
                }}
                onClick={toggleNewCardForm}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add New Card</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' },
                  },
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/*Box Column List Card */}
        <ListCards cards={orderedCards} />
        {/*Box Column Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={toggleNewCardForm} startIcon={<AddCardIcon />}>
                Add New Card
              </Button>
              <Tooltip title="Drap to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                label="Enter column title..."
                variant="outlined"
                type="text"
                size="small"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.text.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#white'),
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    color: (theme) => theme.palette.primary.main,
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Button
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.primary.main,
                    },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  onClick={toggleNewCardForm}
                  fontSize="small"
                  sx={{
                    cursor: 'pointer',
                    color: (theme) => theme.palette.primary.main,
                    '&:hover': {
                      color: (theme) => theme.palette.primary.light,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </CustomSkeleton>
    </div>
  )
}

export default Column
