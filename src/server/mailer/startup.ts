import { red } from 'console-log-colors';
import container from '../di/container';
import type { Mailer } from './mailer';

export async function initMailer() {
	const mailer = container.get<Mailer>('Mailer');

	const isConnected = await mailer.verifyConnection();
	if (!isConnected) {
		throw new Error('Failed to connect to email service');
	}

	console.log(red('Email service initialized successfully'));
}
