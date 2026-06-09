import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';

import { generateProject } from './generate.js';
import { postGenerate, printSuccess } from './postGenerate.js';
import { collectAnswers } from './prompts.js';
import type { CliOptions, PackageManager } from './types.js';

type CliFlags = {
  name?: string;
  slug?: string;
  bundleId?: string;
  scheme?: string;
  onboarding?: boolean;
  auth?: boolean;
  drawer?: boolean;
  tabs?: boolean;
  packageManager?: string;
  git?: boolean;
  install?: boolean;
  yes?: boolean;
};

const PACKAGE_MANAGERS: PackageManager[] = ['yarn', 'npm', 'pnpm'];

function isPackageManager(value: string): value is PackageManager {
  return (PACKAGE_MANAGERS as string[]).includes(value);
}

function readVersion(): string {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(
      readFileSync(path.join(here, '../package.json'), 'utf8'),
    ) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const program = new Command();

program
  .name('create-mds-app')
  .description(
    'Scaffold a production-ready Expo app for MobileDevelopmentSimplified',
  )
  .version(readVersion(), '-v, --version', 'Print the CLI version')
  .argument('[directory]', 'Target directory (defaults to ./<slug>)')
  .option('-n, --name <name>', 'App display name')
  .option('-s, --slug <slug>', 'Expo / npm slug')
  .option('-b, --bundle-id <id>', 'iOS & Android bundle identifier')
  .option('--scheme <scheme>', 'URL scheme (defaults to slug)')
  .option('--onboarding', 'Include FTUE onboarding')
  .option('--no-onboarding', 'Exclude FTUE onboarding')
  .option('--auth', 'Include Supabase auth')
  .option('--no-auth', 'Exclude Supabase auth')
  .option('--drawer', 'Include side drawer navigation')
  .option('--no-drawer', 'Exclude side drawer navigation')
  .option('--tabs', 'Include bottom tab navigation')
  .option('--no-tabs', 'Exclude bottom tab navigation')
  .option(
    '--package-manager <pm>',
    'Package manager: yarn | npm | pnpm',
    'yarn',
  )
  .option('--git', 'Run git init')
  .option('--no-git', 'Skip git init')
  .option('--install', 'Install dependencies')
  .option('--no-install', 'Skip dependency install')
  .option('-y, --yes', 'Accept defaults (all modules on)')
  .action(async (directory: string | undefined, flags: CliFlags) => {
    try {
      if (flags.packageManager && !isPackageManager(flags.packageManager)) {
        console.error(
          pc.red(
            `Error: Invalid package manager "${flags.packageManager}". Use one of: ${PACKAGE_MANAGERS.join(', ')}.`,
          ),
        );
        process.exit(1);
      }

      const options: CliOptions = {
        name: flags.name,
        slug: flags.slug,
        bundleId: flags.bundleId,
        scheme: flags.scheme,
        dir: directory,
        onboarding: flags.onboarding,
        auth: flags.auth,
        drawer: flags.drawer,
        tabs: flags.tabs,
        packageManager: flags.packageManager as PackageManager | undefined,
        git: flags.git,
        install: flags.install,
        yes: flags.yes,
      };

      const answers = await collectAnswers(options);
      if (!answers) {
        process.exit(1);
      }

      await generateProject(answers);
      await postGenerate(answers);
      printSuccess(answers);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(pc.red(`Error: ${message}`));
      process.exit(1);
    }
  });

program.parse();
