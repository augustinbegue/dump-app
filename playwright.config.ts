import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview --workspace=website',
		port: 4173
	},
	testMatch: ['/e2e/**/*.spec.ts']
};

export default config;
