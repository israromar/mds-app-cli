import 'intl-pluralrules';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { type Language, SupportedLanguages } from '@/hooks/language/schema';

import en from './en-EN.json';

export const defaultNS = 'app';

export const resources = {
  'en-EN': en,
} as const satisfies Record<Language, unknown>;

void i18n.use(initReactI18next).init({
  defaultNS,
  fallbackLng: SupportedLanguages.EN_EN,
  lng: SupportedLanguages.EN_EN,
  pluralSeparator: '_',
  resources,
  react: {
    useSuspense: false,
  },
});

i18n.services.formatter?.add(
  'capitalize',
  (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
);

export { default } from 'i18next';
