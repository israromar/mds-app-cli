import * as z from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
}

export const languageSchema = z.enum([SupportedLanguages.EN_EN]);

export type Language = z.infer<typeof languageSchema>;
