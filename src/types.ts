export type PackageManager = 'yarn' | 'npm' | 'pnpm';

export type ModuleFlags = {
  onboarding: boolean;
  auth: boolean;
  drawer: boolean;
  tabs: boolean;
};

export type GeneratorAnswers = {
  appName: string;
  slug: string;
  bundleId: string;
  scheme: string;
  packageName: string;
  modules: ModuleFlags;
  packageManager: PackageManager;
  gitInit: boolean;
  installDeps: boolean;
  targetDir: string;
};

export type CliOptions = {
  name?: string;
  slug?: string;
  bundleId?: string;
  scheme?: string;
  dir?: string;
  onboarding?: boolean;
  auth?: boolean;
  drawer?: boolean;
  tabs?: boolean;
  packageManager?: PackageManager;
  git?: boolean;
  install?: boolean;
  yes?: boolean;
};
