/**
 * Create a slugified version of a string.
 *
 * @param str The string to slugify
 *
 * @return {string} A URL-safe version of a string
 */
export function slugify(str: string): string {
  const slug: string = str
    .toString()
    .normalize('NFD')
    .toLowerCase()
    .replace(/[^a-zA-Z\d\s_-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/([-_]{2,})/g, '-');

  return slug.trim();
}
