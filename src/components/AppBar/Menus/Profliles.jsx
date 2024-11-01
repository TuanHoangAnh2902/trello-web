import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import { useSelector } from 'react-redux';
import { logoutAPI } from '~/apis';
import { toast } from 'react-toastify';

function Profliles({ isLoading }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const navigate = useNavigate();

	const user = useSelector((state) => state.user.user);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const hanldeLogOut = async () => {
		navigate('/user');
		toast.success('Logout Successfully', {
			position: 'top-right',
		});
		await logoutAPI();
	};

	return (
		<Box>
			<Tooltip title='Account settings'>
				<IconButton
					onClick={handleClick}
					size='small'
					sx={{ padding: 0 }}
					aria-controls={open ? 'basic-menu-profliles' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					{isLoading ? (
						<Skeleton
							animation='wave'
							variant='circular'
							width={36}
							height={36}
						/>
					) : (
						<Avatar
							sx={{ width: 36, height: 36 }}
							alt={user?.name}
							src={user?.avatar}
						/>
					)}
				</IconButton>
			</Tooltip>
			<Menu
				id='basic-menu-profliles'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button-profliles',
				}}>
				<MenuItem onClick={handleClose}>
					<Avatar sx={{ width: 28, height: 28, marginRight: 2 }} /> Profile
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<Avatar sx={{ width: 28, height: 28, marginRight: 2 }} /> My account
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<PersonAdd fontSize='small' />
					</ListItemIcon>
					Add another account
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Settings fontSize='small' />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem onClick={hanldeLogOut}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</Box>
	);
}

export default Profliles;
