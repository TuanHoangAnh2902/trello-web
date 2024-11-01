const capitalizeFirstLetter = (string) => {
	if (!string) return '';

	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

const generatePlaceholderCard = (column) => {
	return {
		_id: `${column._id}-placeholder-card`,
		boardId: column.boardId,
		columnId: column._id,
		FE_PlaceholderCard: true,
	};
};

export { capitalizeFirstLetter, generatePlaceholderCard };
