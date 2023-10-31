import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [react(), viteTsconfigPaths()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
		include: ['./src/**/__tests__/*.[jt]s(x)?'],
	},
});
