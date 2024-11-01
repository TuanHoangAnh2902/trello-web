import { Skeleton, Stack } from '@mui/material'
import Board from './Board'
import { memo } from 'react'
import _ from 'lodash'

const BoardWrapper = memo(
  ({ data, loading }) => {
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
    return (
      <Stack sx={{ mt: 2, flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
        {loading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} sx={cardSx} variant="rounded" animation="wave" />
            ))}
          </>
        ) : (
          <>{data && data.length > 0 && data.map((dataItem) => <Board key={dataItem._id} board={dataItem} />)}</>
        )}
      </Stack>
    )
  },
  (prevProps, nextProps) => _.isEqual(prevProps.data, nextProps.data) && prevProps.loading === nextProps.loading
)

export default BoardWrapper
