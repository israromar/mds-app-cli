import * as p from '@clack/prompts';
import path from 'node:path';
import pc from 'picocolors';

import type { CliOptions, GeneratorAnswers, PackageManager } from './types.js';
import {
  defaultBundleId,
  slugify,
  validateBundleId,
  validatePackageName,
  validateSlug,
} from './utils.js';

function isCancel<T>(value: T | symbol): value is symbol {
  return p.isCancel(value);
}

function resolveModules(options: CliOptions) {
  const hasExplicitModules =
    options.onboarding !== undefined ||
    options.auth !== undefined ||
    options.drawer !== undefined ||
    options.tabs !== undefined;

  if (options.yes && !hasExplicitModules) {
    return {
      onboarding: true,
      auth: true,
      drawer: true,
      tabs: true,
    };
  }

  if (hasExplicitModules) {
    return {
      onboarding: options.onboarding ?? false,
      auth: options.auth ?? false,
      drawer: options.drawer ?? false,
      tabs: options.tabs ?? false,
    };
  }

  return undefined;
}

export async function collectAnswers(
  options: CliOptions,
): Promise<GeneratorAnswers | null> {
  p.intro(pc.bgCyan(pc.black(' create-mds-app ')));

  const defaultDir = options.dir ?? process.cwd();
  const defaultName = options.name;

  let appName = defaultName;
  if (!appName) {
    const value = await p.text({
      message: 'App display name',
      placeholder: 'My App',
      validate: (input) => (input.trim() ? undefined : 'App name is required'),
    });
    if (isCancel(value)) {
      p.cancel('Cancelled');
      return null;
    }
    appName = value;
  }

  const defaultSlug = options.slug ?? slugify(appName);
  let slug = defaultSlug;
  if (!options.slug && !options.yes) {
    const value = await p.text({
      message: 'App slug (Expo / npm)',
      initialValue: defaultSlug,
      validate: (input) => validateSlug(input),
    });
    if (isCancel(value)) {
      p.cancel('Cancelled');
      return null;
    }
    slug = value;
  }

  const slugError = validateSlug(slug);
  if (slugError) {
    p.log.error(slugError);
    return null;
  }

  const packageNameError = validatePackageName(slug);
  if (packageNameError) {
    p.log.error(packageNameError);
    return null;
  }

  const defaultBundle = options.bundleId ?? defaultBundleId(slug);
  let bundleId = defaultBundle;
  if (!options.bundleId && !options.yes) {
    const value = await p.text({
      message: 'Bundle identifier (iOS & Android)',
      initialValue: defaultBundle,
      validate: (input) => validateBundleId(input),
    });
    if (isCancel(value)) {
      p.cancel('Cancelled');
      return null;
    }
    bundleId = value;
  }

  const bundleIdError = validateBundleId(bundleId);
  if (bundleIdError) {
    p.log.error(bundleIdError);
    return null;
  }

  const scheme = options.scheme ?? slug;

  let modules = resolveModules(options);
  if (!modules) {
    const selected = await p.multiselect({
      message: 'Include modules',
      options: [
        {
          value: 'onboarding',
          label: 'Onboarding (FTUE intro)',
          hint: 'pre-auth swipeable intro',
        },
        {
          value: 'auth',
          label: 'Auth (Supabase)',
          hint: 'email/password + Google + Apple',
        },
        {
          value: 'drawer',
          label: 'Side drawer',
          hint: 'slide-out navigation menu',
        },
        { value: 'tabs', label: 'Bottom tabs', hint: 'floating tab bar' },
      ],
      required: false,
    });
    if (isCancel(selected)) {
      p.cancel('Cancelled');
      return null;
    }
    const set = new Set(selected as string[]);
    modules = {
      onboarding: set.has('onboarding'),
      auth: set.has('auth'),
      drawer: set.has('drawer'),
      tabs: set.has('tabs'),
    };
  }

  let packageManager: PackageManager = options.packageManager ?? 'yarn';
  if (!options.packageManager && !options.yes) {
    const value = await p.select({
      message: 'Package manager',
      options: [
        { value: 'yarn', label: 'Yarn (recommended)' },
        { value: 'npm', label: 'npm' },
        { value: 'pnpm', label: 'pnpm' },
      ],
      initialValue: 'yarn',
    });
    if (isCancel(value)) {
      p.cancel('Cancelled');
      return null;
    }
    packageManager = value as PackageManager;
  }

  let targetDir = options.dir
    ? path.resolve(options.dir)
    : path.join(defaultDir, slug);

  if (!options.dir && !options.yes) {
    const value = await p.text({
      message: 'Project directory',
      initialValue: targetDir,
      validate: (input) => (input.trim() ? undefined : 'Directory is required'),
    });
    if (isCancel(value)) {
      p.cancel('Cancelled');
      return null;
    }
    targetDir = path.resolve(value);
  }

  let gitInit = options.git ?? true;
  let installDeps = options.install ?? true;

  if (!options.yes) {
    const post = await p.confirm({
      message: 'Initialize git and install dependencies?',
      initialValue: true,
    });
    if (isCancel(post)) {
      p.cancel('Cancelled');
      return null;
    }
    gitInit = post;
    installDeps = post;
  }

  return {
    appName,
    slug,
    bundleId,
    scheme,
    packageName: slug,
    modules,
    packageManager,
    gitInit,
    installDeps,
    targetDir,
  };
}
