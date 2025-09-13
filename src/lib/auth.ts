import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { session, user, account, verification } from '@/db/schema';
import { db } from '@/lib/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async () => {},
  },
  trustedOrigins: ['https://local-dev-mac.hardikja.in', 'http://localhost:3000'],
});
