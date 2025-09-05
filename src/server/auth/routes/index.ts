import { Hono } from 'hono';
import { LoginWithEmailAndPasswordController } from '../controllers/loginWithEmailAndPasswordController';
import { logoutUserController } from '../controllers/logoutUserController';
import { signUpWithEmailController } from '../controllers/signUpWithEmailController';
import { jwtMiddleware } from '../middleware/jwtMiddleware';
import type { ResetPasswordController } from '../controllers/resetPasswordController';
import container from '../../di/container';

const authRouter = new Hono();

authRouter.post('/signup/email', signUpWithEmailController);

authRouter.post('/login', LoginWithEmailAndPasswordController);

authRouter.post('/logout', jwtMiddleware, logoutUserController);

authRouter.post('/resetpassword/:email', async (c) => {
  const controller = container.get<ResetPasswordController>('ResetPasswordController');
  return controller.resetPassword(c);
});
export default authRouter;
