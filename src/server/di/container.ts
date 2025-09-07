import { createAuthContainer } from '../../auth-container';
import type { AuthModuleConfig } from '../../config/types';
import env from '../../env';

const config: AuthModuleConfig = {
  database: {
    url: env.DATABASE_URL,
  },
  jwt: { secret: env.JWT_SECRET },
  email: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
    from: env.MAIL_USER,
  },
};

const container = createAuthContainer(config);
export default container;
