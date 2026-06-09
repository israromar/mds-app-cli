# How it works — a learning walkthrough

This doc explains, step by step, how `create-mds-app` turns a set of answers
into a fully-configured Expo app. If you've never built a CLI before, read this
top to bottom.

## The big picture

A project scaffolder is really just three things:

1. **Collect answers** (interactive prompts or CLI flags).
2. **Decide which files to include** and **substitute values** into them.
3. **Write the result** to a new directory and run a few setup commands.

Everything else is polish. Our source mirrors exactly these steps:

```
src/
  index.ts        # entry: parse flags, orchestrate the 3 steps
  prompts.ts      # step 1: collect answers (clack + commander)
  modules.ts      # step 2a: map answers -> files + dependencies
  generate.ts     # step 2b: copy/render the template
  postGenerate.ts # step 3: git init, install, print next steps
  utils.ts        # slug/bundle-id helpers + validation
  types.ts        # shared types
templates/base/   # the app boilerplate (static files + .ejs templates)
```

## Step 1 — Collecting answers (`prompts.ts`)

We support two modes from one code path:

- **Interactive**: [`@clack/prompts`](https://github.com/bombshell-dev/clack)
  renders the nice text/select prompts.
- **Non-interactive**: [`commander`](https://github.com/tj/commander.js) parses
  flags in `index.ts`; if `--yes` or all required flags are present, we skip the
  prompts entirely.

The output is a single `GeneratorAnswers` object (see `types.ts`). Defaults are
derived so the user can answer as little as one question:

- `slug` defaults from the app name via `slugify()`.
- `bundleId` defaults from the slug via `defaultBundleId()`.
- `scheme` defaults to the slug with dashes removed.

We validate the slug (npm package rules) and bundle id (reverse-DNS) in
`utils.ts` before continuing.

## Step 2a — Which files & deps? (`modules.ts`)

The four optional modules are `onboarding`, `auth`, `drawer`, `tabs`. Two maps
drive everything:

- `MODULE_PATHS` — for each module, the template paths that should **only** be
  copied when that module is enabled (e.g. `auth` owns `src/features/auth`,
  the Supabase client, the auth navigator, etc.).
- `MODULE_DEPENDENCIES` — the npm packages each module adds on top of
  `CORE_DEPENDENCIES`.

Two pure functions expose this:

- `shouldIncludePath(relativePath, modules)` → `boolean`
- `buildDependencyMaps(modules)` → `{ dependencies, devDependencies }`

Keeping these as pure functions makes them trivial to reason about and test.

## Step 2b — Rendering the template (`generate.ts`)

The template lives in `templates/base/`. There are two kinds of files:

- **Static files** — copied verbatim (e.g. `babel.config.js`, theme files).
- **`.ejs` templates** — rendered with [EJS](https://ejs.co/) and written
  **without** the `.ejs` extension (e.g. `app.config.ts.ejs` → `app.config.ts`).

`generateProject()`:

1. Walks every file under `templates/base`.
2. Calls `shouldIncludePath()` to skip excluded module files.
3. If a file ends in `.ejs`, renders it with the **template context** (built by
   `buildTemplateContext()` — app name, slug, bundle id, the `hasAuth` /
   `hasDrawer` / `hasTabs` / `hasOnboarding` booleans, and the merged
   dependency maps). Otherwise the file is copied as-is.
4. Writes the result into the target directory.

### Why EJS booleans matter

The navigation layer is the interesting part. Instead of shipping four separate
navigator files per combination, a single `Application.tsx.ejs` composes the
right tree using `<% if (hasAuth) { %> ... <% } %>` blocks. The same trick wires
`AppNavigator`, the drawer and the tabs. This is how "drawer + tabs + auth" and
"plain stack, no auth" both come out of one template and **both typecheck**.

## Step 3 — Finishing up (`postGenerate.ts`)

- `git init` + set branch to `main` (unless `--no-git`).
- Install dependencies with the chosen package manager (unless `--no-install`).
- `printSuccess()` prints the directory, identity, and tailored next steps
  (it points to `docs/POST_GENERATION_SETUP.md`, and mentions Supabase only when
  auth was included).

## How we verify it actually works

Generated apps must compile. The verification loop is:

1. Generate a combination into a temp dir.
2. Symlink a known-good `node_modules` (or run a real install).
3. Run `tsc --noEmit`.

We do this across the key module combinations (all-on, all-off, and the common
mixes). If any combination fails to typecheck, the template is broken — fix it
before publishing.

## Extending it

Adding your own module (say, `payments`) is a small, mechanical change. See
[ADD_A_MODULE.md](./ADD_A_MODULE.md).
