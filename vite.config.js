import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: [{ find: '~', replacement: '/src' }],
	},
	optimizeDeps: {
		include: ['@mui/material', '@mui/lab'],
	},
	build: {
		rollupOptions: {
			external: ['@mui/material/DefaultPropsProvider'],
		},
	},
});
