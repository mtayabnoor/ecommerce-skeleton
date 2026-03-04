import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from './lib/prisma';
import { compareSync, hashSync } from 'bcrypt-ts-edge';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  plugins: [],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    hashPassword: async (password: string) => {
      return hashSync(password, 10);
    },
    verifyPassword: async ({ password, hash }: { password: string; hash: string }) => {
      return compareSync(password, hash);
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },

  user: {
    additionalFields: {
      firstName: {
        type: 'string',
        required: false,
      },
      lastName: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
      },
    },
  },
});
