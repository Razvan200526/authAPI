import { Hono } from 'hono';
import container from '../../di/container';
import { LoginWithEmailAndPasswordController } from '../controllers/loginWithEmailAndPasswordController';
import { LoginWithUsernameController } from '../controllers/loginWithUsernameAndPasswordController';
import { LogoutUserController } from '../controllers/logoutUserController';
import type { ResetPasswordController } from '../controllers/resetPasswordController';
import { SignUpWithEmailController } from '../controllers/signUpWithEmailController';
import { jwtMiddleware } from '../middleware/jwtMiddleware';

const authRouter = new Hono();

authRouter.post('/signup/email', async (c) => {
	const controller = container.get<SignUpWithEmailController>(
		'SignUpWithEmailController',
	);
	return controller.signupWithEmail(c);
});

authRouter.post('/login/email', async (c) => {
	const controller = container.get<LoginWithEmailAndPasswordController>(
		'LoginWithEmailAndPasswordController',
	);
	return controller.loginWithEmail(c);
});

authRouter.post('login/username', async (c) => {
	const controller = container.get<LoginWithUsernameController>(
		'LoginWithUsernameController',
	);
	return controller.loginWithUsername(c);
});

authRouter.post('/logout', jwtMiddleware, async (c) => {
	const controller = container.get<LogoutUserController>(
		'LogoutUserController',
	);
	return controller.logout(c);
});

authRouter.post('/reset-password/request', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.resetPassword(c);
});

authRouter.get('/reset-password/validate/:token', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.verifyResetToken(c);
});

authRouter.post('/reset-password/confirm', async (c) => {
	const controller = container.get<ResetPasswordController>(
		'ResetPasswordController',
	);
	return controller.confirmReset(c);
});

export default authRouter;
