# Publishing the CLI

`create-mds-app` is an **unscoped, public** npm package so anyone can run
`npm create mds-app` or `npx create-mds-app`.

## Prerequisites

- An npm account that is a member of the publishing org/owner.
- `npm login` completed locally.
- A clean working tree on `main`.

## What ships

`package.json` controls the published contents:

```json
{
  "name": "create-mds-app",
  "bin": { "create-mds-app": "./dist/index.js" },
  "files": ["dist", "templates"],
  "publishConfig": { "access": "public" }
}
```

Only `dist/` (the bundled CLI) and `templates/` (the boilerplate) are published.
The `prepare` script runs `npm run build`, so `dist/` is always rebuilt before
packing.

## Local test before publishing

Always dry-run the package and test it as a real install:

```bash
npm run build
npm pack --dry-run        # inspect the file list (must include templates/)

# Test the binary end-to-end via npm link:
npm link
cd /tmp && create-mds-app demo-app --slug demo-app --yes --no-install
cd demo-app && yarn install && yarn lint:type-check   # should pass
npm unlink -g create-mds-app
```

> Make sure `templates/` is in the `files` array — forgetting it is the #1
> publishing bug for scaffolders (the CLI installs but has no template to copy).

## Versioning & release

Use semver and let npm tag the git commit:

```bash
npm version patch    # or minor / major
git push --follow-tags
npm publish          # access:public is already set in publishConfig
```

## Post-publish smoke test

```bash
cd /tmp
npx create-mds-app@latest smoke --slug smoke --yes --no-install
```

## Troubleshooting

- **`402 Payment Required`** on first publish of an unscoped name — the name is
  taken or reserved; pick another or claim it.
- **Template missing in the published tarball** — check `files` and re-run
  `npm pack --dry-run`.
- **`dist/index.js` not executable / bad shebang** — the shebang is added by the
  tsup `banner`; do not also put one in `src/index.ts`.
