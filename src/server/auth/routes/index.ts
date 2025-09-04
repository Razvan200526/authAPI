import { Hono } from 'hono';
import { signUpWithEmailController } from '../controllers/signUpWithEmailController';

export const authRoutes = new Hono();

authRoutes.post('/signup/email', signUpWithEmailController);
