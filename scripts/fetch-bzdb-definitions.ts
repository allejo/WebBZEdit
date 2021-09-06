import dedent from 'dedent';
import { writeFileSync } from 'fs';
import { load } from 'js-yaml';
import fetch from 'node-fetch';
import { resolve } from 'path';

// @TODO Update this URL to use the `master` branch when this PR is merged
//    https://github.com/BZFlag-Dev/bzflag.org/pull/42
const BZDB_DOCS_URL =
  'https://raw.githubusercontent.com/BZFlag-Dev/bzflag.org/docs/bzdb/_data/bzdb_settings.yaml';

(async function () {
  const rawBody = await (await fetch(BZDB_DOCS_URL)).text();
  const json = load(rawBody);
  const bzdbTypes: string[] = (json as any)['variables'].map(
    (def: any) => def.name,
  );

  writeFileSync(
    resolve(__dirname, '..', 'src', 'data', 'bzdb-documention.json'),
    JSON.stringify(json, null, '  '),
  );
  writeFileSync(
    resolve(__dirname, '..', 'src', 'data', 'bzdb-types.ts'),
    dedent`
      export type BZDBType = "${bzdbTypes.join('"|"')}";
    `,
  );
})();
