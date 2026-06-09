/**
 * Generates a fallback avatar URL using the UI Avatars API.
 * @param name The display name or username to generate initials for.
 * @param options Custom styling options (background, text color, size).
 */
export function getFallbackAvatar(
  name: string,
  options: {
    readonly background?: string;
    readonly color?: string;
    readonly size?: number;
  } = {},
): string {
  const { background = 'random', color = 'fff', size } = options;
  const encodedName = encodeURIComponent(name.trim() || 'H');

  let url = `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}`;
  if (size) {
    url += `&size=${size}`;
  }
  return url;
}
