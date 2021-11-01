import dedent from 'dedent';

export function bzw(
  strings: TemplateStringsArray,
  ...placeholders: any[]
): string {
  return dedent(strings)
    .replace(/(\r\n|\r|\n)/g, '\r\n')
    .trim();
}
