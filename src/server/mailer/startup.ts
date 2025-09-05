import { red } from 'console-log-colors';
import container from '../di/container';
import type { Mailer } from './mailer';

async function initializeServices() {
	const mailer = container.get<Mailer>('Mailer');

	const isConnected = await mailer.verifyConnection();
	if (!isConnected) {
		throw new Error('Failed to connect to email service');
	}

	console.log(red('Email service initialized successfully'));
}

await initializeServices();
