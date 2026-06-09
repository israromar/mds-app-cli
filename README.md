# create-mds-app

Scaffold a production-ready **Expo + React Native** app in seconds — with auth,
navigation, theming, i18n, state management and EAS/OTA already wired up.

Built by **MobileDevelopmentSimplified**, free for everyone to use.

```bash
npm create mds-app@latest
# or
npx create-mds-app my-app
```

## What you get

A clean, opinionated starter based on a real production app:

- **Expo SDK 56 / React Native 0.85** with the New Architecture.
- **React Navigation** — pick a stack, drawer, bottom tabs, or any combination.
- **Supabase auth** (optional) — email/password, Google, Apple, password reset.
- **State & data** — Zustand + MMKV (persisted) and TanStack Query.
- **Styling** — NativeWind 4 (Tailwind) + gluestack-ui, with design tokens.
- **i18n** — `react-i18next` with a typed `en-EN` namespace.
- **Tooling** — TypeScript, Prettier, Jest, EAS Build/Submit/Update, Sentry hook.

## Interactive prompts

Run with no flags for a guided setup:

```bash
npx create-mds-app
```

You'll be asked for the app name, slug, bundle id, URL scheme, which modules to
include, your package manager, and whether to init git / install deps.

## Non-interactive (CI / scripting)

```bash
npx create-mds-app my-app \
  --name "My App" \
  --slug my-app \
  --bundle-id com.acme.myapp \
  --auth --onboarding --drawer --tabs \
  --package-manager yarn --yes
```

| Flag | Description |
|------|-------------|
| `-n, --name <name>` | Display name |
| `-s, --slug <slug>` | Expo slug / package name |
| `-b, --bundle-id <id>` | iOS/Android bundle identifier |
| `--scheme <scheme>` | Deep-link URL scheme |
| `--auth / --no-auth` | Supabase auth module |
| `--onboarding / --no-onboarding` | First-run intro flow |
| `--drawer / --no-drawer` | Side drawer navigator |
| `--tabs / --no-tabs` | Bottom tab navigator |
| `--package-manager <yarn\|npm\|pnpm>` | Package manager |
| `--no-git` / `--no-install` | Skip git init / dependency install |
| `-y, --yes` | Accept defaults, skip prompts |

## After generating

Each generated app contains a `docs/POST_GENERATION_SETUP.md` with the exact
next steps (env vars, EAS, Supabase). The short version:

```bash
cd my-app
cp .env.example .env   # fill in values
yarn start
npx expo prebuild      # when you need native projects
```

## Documentation

- [docs/HOW_IT_WORKS.md](docs/HOW_IT_WORKS.md) — learning walkthrough of the CLI internals.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the generator is structured.
- [docs/ADD_A_MODULE.md](docs/ADD_A_MODULE.md) — add your own optional module.
- [docs/PUBLISHING.md](docs/PUBLISHING.md) — release the CLI to npm.

## Develop the CLI

```bash
npm install
npm run build           # bundle src/ -> dist/ with tsup
node dist/index.js ./tmp-app --name "Test" --slug test-app --yes --no-install
```

## License

MIT
