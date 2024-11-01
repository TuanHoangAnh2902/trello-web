import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';

import App from '~/App.jsx';
import theme from '~/theme.js';
import store from './redux/store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ConfirmProvider } from 'material-ui-confirm';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<CssVarsProvider theme={theme}>
		<Provider store={store}>
			<ConfirmProvider
				defaultOptions={{
					dialogProps: { maxWidth: 'xs' },
				}}>
				<CssBaseline />
				<App />
				<ToastContainer
					position='bottom-left'
					autoClose={2000}
					theme='colored'
				/>
			</ConfirmProvider>
		</Provider>
	</CssVarsProvider>,
	/* </React.StrictMode> */
);
