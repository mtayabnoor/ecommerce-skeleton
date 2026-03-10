import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { nextCookies } from 'better-auth/next-js';
import { APP_HASH_ALGO } from './constants';
import { hash as argon2Hash, verify as argon2Verify, argon2id } from 'argon2';
import { hash as bcryptHash, compare as bcryptVerify } from 'bcrypt';
import { createAuthMiddleware } from 'better-auth/api';

const HASH_ALGO = APP_HASH_ALGO;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
    password: {
      hash: async (password: string) => {
        if (HASH_ALGO === 'bcrypt') {
          const saltRounds = 12;
          return await bcryptHash(password, saltRounds);
        }

        return await argon2Hash(password, {
          type: argon2id,
          memoryCost: 19456,
          timeCost: 2,
          parallelism: 1,
        });
      },

      verify: async ({ password, hash }: { password: string; hash: string }) => {
        if (hash.startsWith('$2')) {
          return await bcryptVerify(password, hash);
        }

        if (hash.startsWith('$argon2')) {
          return await argon2Verify(hash, password);
        }

        return false;
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        console.log(ctx.body.email);
      }
    }),
  },
  user: {
    additionalFields: {
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      role: { type: ['USER', 'ADMIN'], required: true },
      address: { type: 'json', required: false },
      paymentMethod: { type: 'string', required: false },
    },
  },
});
