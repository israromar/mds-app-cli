import validateNpmName from 'validate-npm-package-name';

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const BUNDLE_ID_PATTERN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/i;

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export function defaultBundleId(slug: string): string {
  const segment = slug.replace(/-/g, '');
  return `com.mds.${segment}.app`;
}

export function validateSlug(slug: string): string | undefined {
  if (!slug) {
    return 'Slug is required';
  }
  if (!SLUG_PATTERN.test(slug)) {
    return 'Use lowercase letters, numbers, and hyphens (must start with a letter)';
  }
  return undefined;
}

export function validateBundleId(bundleId: string): string | undefined {
  if (!bundleId) {
    return 'Bundle ID is required';
  }
  if (!BUNDLE_ID_PATTERN.test(bundleId)) {
    return 'Use reverse-DNS format, e.g. com.company.myapp';
  }
  return undefined;
}

export function validatePackageName(name: string): string | undefined {
  const result = validateNpmName(name);
  if (!result.validForNewPackages) {
    return (
      result.errors?.[0] ?? result.warnings?.[0] ?? 'Invalid npm package name'
    );
  }
  return undefined;
}

export function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function toConstantCase(slug: string): string {
  return slug.replace(/-/g, '_').toUpperCase();
}
