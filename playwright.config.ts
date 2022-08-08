import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 3000
	},
	testMatch: ['/e2e/**/*.spec.ts'],
};

export default config;
