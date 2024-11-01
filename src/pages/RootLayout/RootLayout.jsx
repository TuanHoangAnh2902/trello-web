import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

import AppBar from '~/components/AppBar/AppBar';

import useAuth from '~/customHook/useAuth';

function RootLayout() {
	const { isAuthenticated, user } = useAuth();

	return (
		<Container
			disableGutters
			maxWidth={false}
			sx={{ height: '100vh' }}>
			<AppBar />
			<Outlet />
		</Container>
	);
}

export default RootLayout;
