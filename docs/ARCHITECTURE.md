# Architecture

A single-package Node CLI (ESM, TypeScript) bundled with `tsup`.

## Layout

```
create-mds-app/
  src/                 # CLI source (compiled to dist/)
    index.ts           # commander entry; orchestrates the run
    prompts.ts         # clack interactive flow + flag fallthrough
    modules.ts         # module -> files + dependency rules (pure)
    generate.ts        # template walk + EJS render + write
    postGenerate.ts    # git init, install, success message
    utils.ts           # slugify, defaultBundleId, validators
    types.ts           # GeneratorAnswers, ModuleFlags, CliOptions
    declarations.d.ts  # ambient type for validate-npm-package-name
  templates/base/      # the app boilerplate (static + .ejs)
  docs/                # this documentation
  dist/                # build output (gitignored)
  tsup.config.ts       # build config (esm, node20, shebang banner)
  tsconfig.json
  package.json         # bin: create-mds-app
```

## Data flow

```
CLI flags ─┐
           ├─► collectAnswers() ─► GeneratorAnswers ─► generateProject()
prompts ───┘                                   │
                                               ├─ shouldIncludePath(modules)
                                               ├─ buildTemplateContext(answers)
                                               └─ render .ejs / copy static
                                                       │
                                                       ▼
                                              postGenerate() ─► printSuccess()
```

## Key types (`types.ts`)

- `ModuleFlags` — `{ onboarding, auth, drawer, tabs }` (all booleans).
- `GeneratorAnswers` — everything the generator needs: identity strings,
  `modules`, `packageManager`, `gitInit`, `installDeps`, `targetDir`.
- `CliOptions` — the raw commander flags, before defaults are applied.

## Template conventions

- **`.ejs` = rendered, anything else = copied.** The renderer strips the
  `.ejs` suffix on write.
- **Identity tokens** (`appName`, `slug`, `bundleId`, `scheme`, `expoOwner`,
  `easProjectId`, `ascAppId`, `sentryOrg`, `sentryProject`) are exposed in the
  EJS context. Infra IDs default to empty/placeholder and are surfaced as
  `.env` values and TODOs rather than hard-coded.
- **Module flags** (`hasAuth`, `hasDrawer`, `hasTabs`, `hasOnboarding`) drive
  conditional blocks, especially in the navigation layer.
- **Dependencies** are computed (`buildDependencyMaps`) and injected into
  `package.json.ejs`, so each app only depends on what its modules need.

## Module ownership

| Module | Owns (excluded when off) | Adds deps |
|--------|--------------------------|-----------|
| `auth` | `features/auth`, `services/supabase`, `store/authStore`, `components/auth`, `features/profile/api`, `AuthNavigator`, `ChangePasswordScreen`, `supabase/`, native-auth doc/script | supabase-js, google-signin, apple-auth, base64-arraybuffer, expo-file-system, ky |
| `onboarding` | `features/onboarding` | — |
| `drawer` | `MainDrawerNavigator` | @react-navigation/drawer |
| `tabs` | `MainTabNavigator` | @react-navigation/bottom-tabs |

Everything else (theme, ui, gluestack, services, navigation shell, i18n,
dashboard/profile/settings screens) is **core** and always included.
