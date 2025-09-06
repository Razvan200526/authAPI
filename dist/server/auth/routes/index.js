import { Hono } from 'hono';
import { LoginWithEmailAndPasswordController } from '../controllers/loginWithEmailAndPasswordController';
import { logoutUserController } from '../controllers/logoutUserController';
import { signUpWithEmailController } from '../controllers/signUpWithEmailController';
import { jwtMiddleware } from '../middleware/jwtMiddleware';
import container from '../../di/container';
const authRouter = new Hono();
// Sign up
authRouter.post('/signup/email', signUpWithEmailController);
// Login
authRouter.post('/login', LoginWithEmailAndPasswordController);
// Logout (protected)
authRouter.post('/logout', jwtMiddleware, logoutUserController);
// Request password reset (changed: now uses JSON body instead of :email param)
authRouter.post('/reset-password/request', async (c) => {
    const controller = container.get('ResetPasswordController');
    return controller.resetPassword(c);
});
// Validate token
authRouter.get('/reset-password/validate/:token', async (c) => {
    const controller = container.get('ResetPasswordController');
    return controller.verifyResetToken(c);
});
// Confirm password reset
authRouter.post('/reset-password/confirm', async (c) => {
    const controller = container.get('ResetPasswordController');
    return controller.confirmReset(c);
});
export default authRouter;
//# sourceMappingURL=index.js.map