import type { GeneratorAnswers, ModuleFlags } from './types.js';

/** Paths relative to template root that belong to optional modules. */
const MODULE_PATHS: Record<keyof ModuleFlags, string[]> = {
  auth: [
    'src/features/auth',
    'src/services/supabase',
    'src/store/authStore.ts',
    'src/components/auth',
    'src/features/profile/api',
    'src/navigation/navigators/AuthNavigator.tsx.ejs',
    'src/features/settings/screens/ChangePasswordScreen.tsx',
    'docs/NATIVE_AUTH_SETUP.md.ejs',
    'supabase',
    'scripts/generate-apple-client-secret.mjs',
  ],
  onboarding: ['src/features/onboarding'],
  drawer: [
    'src/navigation/navigators/MainDrawerNavigator.tsx.ejs',
    'src/navigation/components/Drawer',
  ],
  tabs: [
    'src/navigation/navigators/MainTabNavigator.tsx.ejs',
    'src/navigation/components/FloatingTabBar.tsx',
  ],
};

/** npm dependencies added per module (merged into package.json.ejs context). */
export const MODULE_DEPENDENCIES: Record<
  keyof ModuleFlags,
  Record<string, string>
> = {
  auth: {
    '@invertase/react-native-apple-authentication': '^2.5.1',
    '@react-native-google-signin/google-signin': '^16.1.2',
    '@supabase/supabase-js': '^2.105.4',
    'base64-arraybuffer': '^1.0.2',
    'expo-file-system': '~56.0.7',
    ky: '^1.8.2',
  },
  onboarding: {},
  drawer: {
    '@react-navigation/drawer': '^7.9.11',
  },
  tabs: {
    '@react-navigation/bottom-tabs': '^7.15.13',
  },
};

const CORE_DEPENDENCIES: Record<string, string> = {
  '@gluestack-style/react': '^1.0.57',
  '@gluestack-ui/config': '^1.1.20',
  '@gluestack-ui/themed': '^1.1.73',
  '@react-native-community/blur': '^4.4.1',
  '@react-navigation/native': '^7.2.4',
  '@react-navigation/stack': '^7.4.4',
  '@sentry/react-native': '~7.11.0',
  '@tanstack/react-query': '^5.84.0',
  clsx: '^2.1.1',
  expo: '^56.0.5',
  'expo-dev-client': '^56.0.16',
  'expo-image': '~56.0.9',
  'expo-updates': '^56.0.17',
  i18next: '^25.3.2',
  'intl-pluralrules': '^2.0.1',
  'lucide-react-native': '^1.14.0',
  nativewind: '^4.2.3',
  react: '19.2.3',
  'react-error-boundary': '^6.1.1',
  'react-i18next': '^16.5.4',
  'react-native': '0.85.3',
  'react-native-gesture-handler': '^2.27.2',
  'react-native-keyboard-controller': '1.21.6',
  'react-native-mmkv': '^4.1.2',
  'react-native-nitro-modules': '^0.35.6',
  'react-native-reanimated': '4.3.1',
  'react-native-safe-area-context': '~5.7.0',
  'react-native-screens': '^4.23.0',
  'react-native-svg': '15.15.4',
  'react-native-url-polyfill': '^2.0.0',
  'react-native-worklets': '0.8.3',
  'tailwind-merge': '^3.5.0',
  zod: '^4.0.14',
  zustand: '^5.0.13',
};

const CORE_DEV_DEPENDENCIES: Record<string, string> = {
  '@babel/core': '^7.25.2',
  '@babel/plugin-transform-class-static-block': '^7.28.6',
  '@babel/plugin-transform-export-namespace-from': '^7.27.1',
  '@react-native/jest-preset': '^0.85.3',
  '@react-native/metro-config': '0.85.3',
  '@types/jest': '^29.5.12',
  '@types/react': '^19.2.0',
  'babel-plugin-dynamic-import-node': '^2.3.3',
  'babel-plugin-module-resolver': '^5.0.0',
  'babel-preset-expo': '^56.0.13',
  dotenv: '^16.4.7',
  'eas-cli': '^19.1.0',
  jest: '^29.7.0',
  prettier: '^3.6.2',
  'react-native-svg-transformer': '^1.5.0',
  tailwindcss: '^3.4.17',
  typescript: '~6.0.3',
};

/** Escape a string for embedding inside a double-quoted JSON string (no surrounding quotes). */
function escapeJsonStringBody(value: string): string {
  const quoted = JSON.stringify(value);
  return quoted.slice(1, -1);
}

/** Escape a string for embedding inside a single-quoted JS/TS string literal. */
function escapeJsSingleQuoted(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/[\r\n\t]/g, ' ');
}

export function shouldIncludePath(
  relativePath: string,
  modules: ModuleFlags,
): boolean {
  const normalized = relativePath.replace(/\\/g, '/');

  for (const [moduleName, paths] of Object.entries(MODULE_PATHS) as [
    keyof ModuleFlags,
    string[],
  ][]) {
    if (modules[moduleName]) {
      continue;
    }

    for (const pattern of paths) {
      if (normalized === pattern || normalized.startsWith(`${pattern}/`)) {
        return false;
      }
    }
  }

  return true;
}

export function buildDependencyMaps(modules: ModuleFlags): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies = { ...CORE_DEPENDENCIES };
  const devDependencies = { ...CORE_DEV_DEPENDENCIES };

  for (const [moduleName, deps] of Object.entries(MODULE_DEPENDENCIES) as [
    keyof ModuleFlags,
    Record<string, string>,
  ][]) {
    if (!modules[moduleName]) {
      continue;
    }
    Object.assign(dependencies, deps);
  }

  return { dependencies, devDependencies };
}

export function buildTemplateContext(answers: GeneratorAnswers) {
  const { modules } = answers;
  const { dependencies, devDependencies } = buildDependencyMaps(modules);

  const hasDrawer = modules.drawer;
  const hasTabs = modules.tabs;
  const hasAuth = modules.auth;
  const hasOnboarding = modules.onboarding;

  const rootNavigator =
    hasDrawer && hasTabs
      ? 'drawer-tabs'
      : hasDrawer
        ? 'drawer-only'
        : hasTabs
          ? 'tabs-only'
          : 'stack-only';

  return {
    ...answers,
    i18nNamespace: answers.slug.replace(/-/g, '_'),
    pascalName: answers.appName.replace(/\s+/g, ''),
    // Pre-escaped variants of the only free-text identity field. Use these
    // inside syntax-sensitive contexts so a name containing quotes/backslashes
    // cannot corrupt generated JSON or break JS/TS string literals.
    appNameJson: escapeJsonStringBody(answers.appName),
    appNameJs: escapeJsSingleQuoted(answers.appName),
    modules,
    hasAuth,
    hasOnboarding,
    hasDrawer,
    hasTabs,
    rootNavigator,
    dependencies,
    devDependencies,
    expoOwner: 'YOUR_EXPO_USERNAME',
    easProjectId: 'YOUR_EAS_PROJECT_ID',
    appleTeamId: 'YOUR_APPLE_TEAM_ID',
    ascAppId: 'YOUR_ASC_APP_ID',
    sentryOrg: 'YOUR_SENTRY_ORG',
    sentryProject: answers.slug,
  };
}

export type TemplateContext = ReturnType<typeof buildTemplateContext>;
