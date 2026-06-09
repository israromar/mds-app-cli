# Add a new module

Suppose you want an optional `payments` module. Five small steps:

## 1. Add the flag

`src/types.ts`:

```ts
export type ModuleFlags = {
  onboarding: boolean;
  auth: boolean;
  drawer: boolean;
  tabs: boolean;
  payments: boolean; // new
};
```

## 2. Prompt for it

`src/prompts.ts` — add an option to the module multi-select and read the flag in
`index.ts` (`--payments / --no-payments`).

## 3. Declare files & dependencies

`src/modules.ts`:

```ts
const MODULE_PATHS: Record<keyof ModuleFlags, string[]> = {
  // ...
  payments: ['src/features/payments'],
};

export const MODULE_DEPENDENCIES = {
  // ...
  payments: { 'react-native-purchases': '^8.0.0' },
};
```

Files listed in `MODULE_PATHS.payments` are only copied when the flag is on.
Anything outside every module's list is treated as **core** (always included).

## 4. Add the template files

Create `templates/base/src/features/payments/...`. Use `.ejs` for any file that
needs values or conditionals; the context exposes `hasPayments` automatically
(every `ModuleFlags` key becomes a `has<Capitalized>` boolean in
`buildTemplateContext`).

If a core file needs to reference the module conditionally (e.g. add a Settings
row), convert it to `.ejs` and wrap the bit in `<% if (hasPayments) { %> ... <% } %>`.

## 5. Verify

Generate with and without the module and typecheck both:

```bash
npm run build
node dist/index.js /tmp/with --slug with --payments --yes --no-install
node dist/index.js /tmp/without --slug without --no-payments --yes --no-install
# install (or symlink node_modules) then: npx tsc --noEmit
```

If both compile, you're done.

## Rules of thumb

- Keep `MODULE_PATHS` / `MODULE_DEPENDENCIES` as the single source of truth.
- A module should be **removable without breaking core** — never import a
  module's files from core code unless guarded by an `.ejs` conditional.
- Prefer adding deps to the module, not core, to keep generated apps lean.
