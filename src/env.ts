import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

export const env = createEnv({
  server: {
    SERVER_PORT: z
      .string()
      // transform to number
      .transform((s) => parseInt(s, 10))
      // make sure it's a number
      .pipe(z.number())
      // set a default
      .default('5433'),
    DB_URL: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    // Mongo DB Variables
    MONGO_USER: z.string().min(1),
    MONGO_PASSWORD: z.string().min(1),
    MONGO_DB: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  isServer: typeof window === 'undefined',
});
