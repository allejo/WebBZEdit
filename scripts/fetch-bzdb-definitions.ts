import dedent from 'dedent';
import { writeFileSync } from 'fs';
import { load } from 'js-yaml';
import fetch from 'node-fetch';
import { resolve } from 'path';

// prettier-ignore
const BZDB_DOCS_URL = 'https://raw.githubusercontent.com/BZFlag-Dev/bzflag.org/master/_data/bzdb_settings.yaml';

(async function () {
  const rawBody = await (await fetch(BZDB_DOCS_URL)).text();
  const json: any = load(rawBody);
  const bzdbTypes: string[] = json['variables'].map((def: any) => def.name);

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
