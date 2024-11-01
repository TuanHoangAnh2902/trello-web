import Box from '@mui/material/Box';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Card from './Card/Card';
function ListCards({ cards }) {
	return (
		<SortableContext
			items={cards?.map((column) => column._id)} // Adjusted to pass item IDs
			strategy={verticalListSortingStrategy}>
			<Box
				sx={{
					p: '0 5px 5px 5px',
					m: '0 5px',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					overflowX: 'hidden',
					overflowY: 'auto',
					maxHeight: (theme) =>
						`calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${
							theme.trello.columnHeaderHeight
						} - ${theme.trello.columnFooterHeight})`,
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#ced0da',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#bfc2cf',
					},
				}}>
				{cards?.map((card) => (
					<Card
						key={card._id}
						card={card}
					/>
				))}
			</Box>
		</SortableContext>
	);
}

export default ListCards;