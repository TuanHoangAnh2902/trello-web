// Authemtication - Register, Register, SignOut
import { useState } from 'react';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { ReactComponent as LoginIcon } from '~/assets/login.svg';
import { ReactComponent as RegisterIcon } from '~/assets/register.svg';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import Login from './Login';
import Register from './Register';

function Auth() {
	const [value, setValue] = useState('1');

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<Container
			disableGutters
			maxWidth={false}
			sx={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				gap: 3,
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				<SvgIcon
					component={TrelloIcon}
					inheritViewBox
					sx={{ color: 'primary.main', fontSize: '50px' }}
				/>
				<Typography
					variant='span'
					sx={{
						fontFamily: (theme) => theme.font.logoFont,
						fontSize: '2.2rem',
						fontWeight: 'bold',
						color: 'primary.main',
					}}>
					Trello
				</Typography>
			</Box>
			<Box
				sx={{
					maxWidth: '100%',
					typography: 'body1',
				}}>
				<Card
					sx={{
						maxWidth: '400px',
						fontSize: '0.5rem',
					}}>
					<TabContext value={value}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<TabList
								variant='fullWidth'
								onChange={handleChange}
								aria-label='lab API tabs example'>
								<Tab
									sx={{ gap: 0.5 }}
									icon={
										<SvgIcon
											component={LoginIcon}
											inheritViewBox
										/>
									}
									iconPosition='end'
									label='Login'
									value='1'
								/>
								<Tab
									sx={{ gap: 0.5 }}
									icon={
										<SvgIcon
											component={RegisterIcon}
											inheritViewBox
										/>
									}
									iconPosition='end'
									label='Register'
									value='2'
								/>
							</TabList>
						</Box>
						<TabPanel value='1'>
							<Login setValue={setValue} />
						</TabPanel>
						<TabPanel value='2'>
							<Register setValue={setValue} />
						</TabPanel>
					</TabContext>
				</Card>
			</Box>
		</Container>
	);
}

export default Auth;
