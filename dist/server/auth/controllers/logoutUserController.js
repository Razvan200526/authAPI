import { logoutUserService } from '../services/logoutUserService';
export const logoutUserController = async (c) => {
    try {
        // Get user info from context (set by JWT middleware)
        const user = c.get('user');
        if (!user) {
            return c.json({ error: 'User information not found' }, 401);
        }
        // Get user ID from the JWT payload
        const userId = user.sub || user.userId || user.id;
        if (!userId) {
            return c.json({ error: 'Invalid user ID in token' }, 401);
        }
        // Use the service to handle logout logic
        const result = await logoutUserService(parseInt(userId, 10));
        return c.json({
            message: result.message,
            timestamp: result.timestamp,
        }, 200);
    }
    catch (error) {
        if (error instanceof Error) {
            return c.json({ error: error.message || 'Internal server error' }, 500);
        }
        console.error('Logout controller error:', error);
    }
};
//# sourceMappingURL=logoutUserController.js.map