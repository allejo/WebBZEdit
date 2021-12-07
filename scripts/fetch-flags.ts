import { Octokit } from '@octokit/rest';
import { writeFileSync } from 'fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';
import { resolve } from 'path';

import { FlagDocumentation } from '../src/definitions/FlagDocumentation';

const octokit = new Octokit();
const dataDir = resolve(__dirname, '..', 'src', 'data');

function fmParse(str: string) {
  const fmRegex = /---\n([\s\S]+)---\n([\s\S]+)/g;
  const matches = fmRegex.exec(str);

  return {
    frontMatter: yaml.load(matches![1]),
    body: matches![2].trim().split('\n')[0],
  };
}

async function getFlagDocs(): Promise<FlagDocumentation[]> {
  const { data: flagDocs } = await octokit.repos.getContent({
    owner: 'bzflag-dev',
    repo: 'bzflag.org',
    path: '_documentation/user/flags',
  });

  if (!Array.isArray(flagDocs)) {
    throw Error(
      'getFlagDocs expected to receive a directory of flag documentation, received single file.',
    );
  }

  const flags: FlagDocumentation[] = [];

  for (const flagDoc of flagDocs) {
    if (flagDoc.type !== 'file' || flagDoc.download_url === null) {
      continue;
    }

    const rawBody = await (await fetch(flagDoc.download_url)).text();
    const document = fmParse(rawBody);

    flags.push(document.frontMatter as FlagDocumentation);
  }

  return flags;
}

(async function () {
  const flags = await getFlagDocs();

  writeFileSync(
    resolve(dataDir, 'flags.json'),
    JSON.stringify(flags, null, '  '),
  );
})();
