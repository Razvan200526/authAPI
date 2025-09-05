import { Hono } from 'hono';
import { LoginWithEmailAndPasswordController } from '../controllers/loginWithEmailAndPasswordController';
import { logoutUserController } from '../controllers/logoutUserController';
import { signUpWithEmailController } from '../controllers/signUpWithEmailController';
import { jwtMiddleware } from '../middleware/jwtMiddleware';

const authRouter = new Hono();

authRouter.post('/signup/email', signUpWithEmailController);

authRouter.post('/login', LoginWithEmailAndPasswordController);

authRouter.post('/logout', jwtMiddleware, logoutUserController);

export default authRouter;
