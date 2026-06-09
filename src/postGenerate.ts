import { execa } from 'execa';
import pc from 'picocolors';

import type { GeneratorAnswers } from './types.js';

function installCommand(pm: GeneratorAnswers['packageManager']): {
  command: string;
  args: string[];
} {
  switch (pm) {
    case 'npm':
      return { command: 'npm', args: ['install'] };
    case 'pnpm':
      return { command: 'pnpm', args: ['install'] };
    default:
      return { command: 'yarn', args: ['install'] };
  }
}

export async function postGenerate(answers: GeneratorAnswers): Promise<void> {
  if (answers.gitInit) {
    await execa('git', ['init'], { cwd: answers.targetDir });
    await execa('git', ['branch', '-M', 'main'], { cwd: answers.targetDir });
  }

  if (answers.installDeps) {
    const { command, args } = installCommand(answers.packageManager);
    await execa(command, args, {
      cwd: answers.targetDir,
      stdio: 'inherit',
    });
  }
}

export function printSuccess(answers: GeneratorAnswers): void {
  const rel = answers.targetDir;
  const pm = answers.packageManager;
  const startCmd =
    pm === 'npm' ? 'npm start' : pm === 'pnpm' ? 'pnpm start' : 'yarn start';

  console.log('');
  console.log(pc.green('✓ Project created successfully'));
  console.log('');
  console.log(`  ${pc.dim('Directory:')} ${rel}`);
  console.log(`  ${pc.dim('App name:')}  ${answers.appName}`);
  console.log(`  ${pc.dim('Bundle ID:')} ${answers.bundleId}`);
  console.log('');
  console.log(pc.bold('Next steps:'));
  console.log(`  1. cd ${rel}`);
  console.log('  2. Copy .env.example to .env and fill in values');
  if (answers.modules.auth) {
    console.log(
      '  3. Follow docs/POST_GENERATION_SETUP.md for Supabase + OAuth',
    );
  } else {
    console.log('  3. Read docs/POST_GENERATION_SETUP.md for EAS / OTA setup');
  }
  console.log(`  4. ${startCmd}`);
  console.log('  5. npx expo prebuild   # when you need native projects');
  console.log('');
}
