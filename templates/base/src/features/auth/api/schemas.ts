import * as z from 'zod';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_RESET_CODE_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@/constants/auth';

export const emailSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : value),
  z.email(),
);

export const passwordSchema = z.string().min(PASSWORD_MIN_LENGTH);

export const resetCodeSchema = z
  .string()
  .trim()
  .length(PASSWORD_RESET_CODE_LENGTH)
  .regex(/^\d+$/);

export const usernameSchema = z
  .string()
  .trim()
  .min(2)
  .max(USERNAME_MAX_LENGTH)
  .regex(/^\w+$/);
