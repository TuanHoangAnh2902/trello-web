import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import { fetchFullBoardAPI } from '~/apis'

const cardSx = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxShadow: '0',
  cursor: 'pointer',
  transition: 'all 0.1s linear',
  textDecoration: 'none',
  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
}

function Search() {
  const [boards, setBoards] = useState([])

  const userId = useSelector((state) => state?.user?.user?._id)

  useEffect(() => {
    if (!userId) return

    const getAllBoards = async () => {
      const res = await fetchFullBoardAPI(userId)
      if (res) {
        setBoards(res)
      }
    }

    getAllBoards()
  }, [userId])

  // Kiểm tra xem boards có dữ liệu chưa và tạo options cho react-select
  const options =
    boards.length > 0 &&
    boards?.map((board) => ({
      value: board.title, // Gán giá trị cho option để dễ dàng quản lý
      label: (
        <Card sx={cardSx} component={Link} to={`/root/boards/${board._id}`}>
          <CardMedia
            key={board._id}
            component="img"
            sx={{ width: 30, height: 30, ml: 2, borderRadius: '2px' }}
            image={board.bgImage || ''}
            alt={board.title}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', m: '4px 4px 4px 8px' }}>
            <CardContent sx={{ flex: '1 0 auto', p: 0, '&:last-child': { paddingBottom: 0 } }}>
              <Typography fontSize={'14px'} lineHeight={'1.2'} component="div" variant="h6">
                {board.title}
              </Typography>
              <Typography fontSize={'12px'} lineHeight={'1.2'} variant="subtitle1" color="text.secondary">
                {board.description}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ),
    }))

  return (
    <Box sx={{ minWidth: '250px' }} className="search-container">
      <Select
        className="search"
        classNamePrefix="search-item"
        value={''}
        options={options}
        menuPortalTarget={document.body} // Gắn dropdown vào body để không bị ẩn
        menuPosition="fixed" // Cố định vị trí của dropdown khi cuộn trang
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Đặt z-index cao
          option: (base) => ({ ...base, height: '100%', padding: 0 }),
        }}
        placeholder="Search..."
        isClearable
      />
    </Box>
  )
}

export default Search
