import { cloneDeep, isEmpty } from 'lodash'

import { useCallback, useEffect, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  // PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { useDispatch, useSelector } from 'react-redux'
import { moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndkitSensors'
import { generatePlaceholderCard } from '~/utils/formatters'
import { setBoard } from '../boardsSlice'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}

function BoardContent({ isLoading }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  // cùng 1 thời điểm chỉ có 1 phần tử được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  const dispatch = useDispatch()

  const board = useSelector((state) => state.boardsSlice.board)

  // điểm va chạm cuối cùng trước đó
  const lastOverId = useRef(null)

  // gọi API cập nhật vị trí column khi kéo thả
  const moveColumn = (dndOrderedColumns) => {
    // update state phía client
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(setBoard(newBoard))

    // gọi API update vị trí column
    updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnsIds,
    })
  }

  // gọi API cập nhật cardOrderIds khi kéo thả card trong column chứa nó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state phía client
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(setBoard(newBoard))

    // gọi API update vị trí card trong column
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    })
  }

  useEffect(() => {
    if (board?.columns && board?.columnOrderIds) {
      setOrderedColumns(board.columns)
    }
  }, [board])

  // tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

  // https://docs.dndkit.com/api-documentation/sensors
  // const pointerSensor = useSensor(PointerSensor, {
  // 	activationConstraint: { distance: 10 },
  // });

  // yêu cầu chuột di chuyển ít nhất 10px mới gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  })

  // nhấn giữ 250ms và di chuyển ít nhất 500px mới gọi event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  })

  // ưu tiên sử dụng kết hợp 2 loại sensors là MouseSensor và TouchSensor để có trải nghiệm mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor)

  /**
   * khi di chuyển card sang column khác:
   * B1: cập nhật lại cardOrderIds của column cũ chứa nó
   * B2: cập nhật lại cardOrderIds của column mới chứa nó
   * B3: cập nhật lại columnId của card được kéo
   */
  const moveCardToDifferentColumn = async (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // update state phía client
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(setBoard(newBoard))

    // gọi Api
    let prevCardOrderIds = dndOrderedColumns.find((column) => column._id === prevColumnId)?.cardOrderIds || []
    // xóa phần từ placeholder-card nếu có trong mảng cardOrderIds trước khi gửi dữ liệu lên BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((column) => column._id === nextColumnId)?.cardOrderIds,
    })
  }

  // Function chung xử lý việc kéo thả card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    activeDraggingCardData,
    activeDraggingCardId,
    activeColumn,
    overCardId,
    overColumn,
    active,
    over,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      // tìm vị trí của overCard đang kéo trong column đích (nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card?._id === overCardId)

      // logic tính toán 'cardIndex' mới (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1

      const nextColumns = cloneDeep(prevColumns)

      const nextActiveColumn = nextColumns.find((column) => column?._id === activeColumn?._id)
      const nextOverColumn = nextColumns.find((column) => column?._id === overColumn?._id)

      // column cũ
      if (nextActiveColumn) {
        // xóa card đang kéo khỏi column cũ
        nextActiveColumn.cards = nextActiveColumn?.cards?.filter((card) => card?._id !== activeDraggingCardId)
        // thêm placeholder card nếu column cũ rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cập nhật lại cardOrderIds của column cũ để đồng bộ dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map((card) => card?._id)
      }
      // column mới
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo đã tồn tại trong overColumn đích chưa, nếu có thì xóa nó đi
        nextOverColumn.cards = nextOverColumn?.cards?.filter((card) => card?._id !== activeDraggingCardId)

        // Đối với card đang kéo qua column khác, cần cập nhật lại columnId của card đó
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        }

        // thêm card đang kéo vào vị trí mới trong overColumn đích
        nextOverColumn.cards = nextOverColumn?.cards?.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // xóa placeholder cả đi khi nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard)

        // cập nhật lại cardOrderIds của column cũ để đồng bộ dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map((card) => card?._id)
      }

      // nếu func được gọi ở handleDragEnd thì gọi API cập nhật sắp xếp
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard?._id,
          nextOverColumn?._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  //trigger khi bắt đầu kéo (Drag) 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )

    // nếu là kéo card thì lưu lại column cũ của card đó
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }

    setActiveDragItemData(event?.active?.data?.current)
  }

  // trigger trong quá trình kéo (drag) phần tử
  const handleDragOver = (event) => {
    // return khi kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // xử lý kéo card qua lại giữa các column
    // console.log('handleDragOver', event);

    const { active, over } = event
    // nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì return
    if (!active || !over) return

    //activeDraggingCard là card đang kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active
    // overCard là card mà activeDraggingCard kéo qua
    const { id: overCardId } = over

    // tìm 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // nếu không tồn tại 1 trong 2 column thì return
    if (!activeColumn || !over) return

    // chỉ xử lý khi kéo card qua lại giữa các column, kéo về column cũ không xử lý
    if (activeColumn?._id !== overColumn?._id) {
      moveCardBetweenDifferentColumns(
        activeDraggingCardData,
        activeDraggingCardId,
        activeColumn,
        overCardId,
        overColumn,
        active,
        over,
        'handleDragOver'
      )
    }
  }

  //trigger khi kết thúc kéo (drag) 1 phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event

    // nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì return
    if (!active || !over) return

    // Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hành động kéo thả card');

      //activeDraggingCard là card đang kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active
      // overCard là card mà activeDraggingCard kéo qua
      const { id: overCardId } = over

      // tìm 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // nếu không tồn tại 1 trong 2 column thì return
      if (!activeColumn || !over) return

      // hành động kéo thả card giữa 2 column khác nhau
      /** phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây thì state của card đã bị cập nhật 1 lần*/
      if (oldColumnWhenDraggingCard?._id !== overColumn?._id) {
        moveCardBetweenDifferentColumns(
          activeDraggingCardData,
          activeDraggingCardId,
          activeColumn,
          overCardId,
          overColumn,
          active,
          over,
          'handleDragEnd'
        )
      } else {
        // hành động kéo thả card trong cùng 1 column

        /** lấy vị trí cũ của phần tử được kéo (từ oldColumnWhenDraggingCard)  */
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((column) => column._id === activeDragItemId)

        /** lấy vị trí mới của phần tử được kéo (từ overColumn)  */
        const newCardIndex = overColumn?.cards?.findIndex((column) => column._id === overCardId)

        // dùng arrayMove của dnd-kit để sắp xếp lại mảng Cards ban đầu
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)
        // update state trước khi gọi API để tránh delay
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)

          // tìm tới columns đang thả card
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)

          // cập nhật 2 giá trị card và cardOrderIds trong targetColumn
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardIds
          }

          // trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }
    // Xử lý kéo thả column trong boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        /** lấy vị trí cũ của phần tử được kéo (từ active)  */
        const oldColumnIndex = orderedColumns.findIndex((column) => column._id === active.id)
        /** lấy vị trí mới của phần tử được kéo (từ active)  */
        const newColumnIndex = orderedColumns.findIndex((column) => column._id === over.id)

        if (oldColumnIndex !== -1 && newColumnIndex !== -1) {
          const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

          // vẫn update state ở client để hiển thị ngay lập tức, tránh bị giật giao diện khi chưa gọi api hoàn tất
          setOrderedColumns(dndOrderedColumns)

          // gọi function moveColumn để cập nhật vị trí column khi kéo thả
          moveColumn(dndOrderedColumns)
        }

        // dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
        // docs: https://docs.dndkit.com/presets/sortable#arraymove
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setOrderedColumns(dndOrderedColumns)

        /** xử lý gọi api cập nhật sắp xếp */
        // const dndOrderedColumnsIds = dndOrderedColumns.map(
        // 	(column) => column._id,
        // );
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds);
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Aniamtion khi (drop) thả phần tử
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: 0.5 } },
    }),
  }

  // custom lại thuật toán phát hiện va chạm
  // args - argument - các đối số, tham số
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // trường hợp kéo column thì dùng thuật toán closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // tìm các điểm giao nhau, va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args)

      // kéo 1 card có image cover lớn và kéo lên phá trên cùng ra khỏi khu vực kéo thả
      if (!pointerIntersections?.length) return

      // thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (không cần bước này nữa)
      // const intersections = !!pointerIntersections?.length
      // 	? pointerIntersections
      // 	: rectIntersection(args);

      // tìm overId đầu tiên trong mảng intersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find((column) => column._id === overId)
        if (checkColumn) {
          // console.log('overId before', overId);

          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            ),
          })[0]?.id
          // console.log('overId after', overId);
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      // nếu không có va chạm thì trả về mảng rỗng - tránh bug
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },

    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      // cảm biến
      sensors={sensors}
      // thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua column được gì lúc này nó đang bị conflict giữa card và column), dùng closestCorners thay vì closestCenter
      // nếu chỉ dùng closestCorners sẽ bị bug giật + clone card gây sai lệch dữ liệu
      // collisionDetection={closestCorners}

      // tự custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          p: '10px 0',
          width: '100%',
          alignItems: 'flex-start',
          // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          backgroundColor: 'transparent', // Màu nền trong suốt
          height: (theme) => theme.trello.boardContentHeight,
        }}
      >
        <ListColumns isLoading={isLoading} columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
