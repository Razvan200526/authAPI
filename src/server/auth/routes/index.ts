import { Hono } from 'hono';
import container from '../../di/container';
import { LoginWithEmailAndPasswordController } from '../controllers/loginWithEmailAndPasswordController';
import { LoginWithUsernameController } from '../controllers/loginWithUsernameAndPasswordController';
import { logoutUserController } from '../controllers/logoutUserController';
import type { ResetPasswordController } from '../controllers/resetPasswordController';
import { signUpWithEmailController } from '../controllers/signUpWithEmailController';
import { jwtMiddleware } from '../middleware/jwtMiddleware';

const authRouter = new Hono();

// Sign up
authRouter.post('/signup/email', signUpWithEmailController);

// Login
authRouter.post('/login/email', LoginWithEmailAndPasswordController);

authRouter.post('login/username', LoginWithUsernameController);

//Logout
authRouter.post('/logout', jwtMiddleware, logoutUserController);

authRouter.post('/reset-password/request', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.resetPassword(c);
});

// Validate token
authRouter.get('/reset-password/validate/:token', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.verifyResetToken(c);
});

// Confirm password reset
authRouter.post('/reset-password/confirm', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.confirmReset(c);
});

export default authRouter;
