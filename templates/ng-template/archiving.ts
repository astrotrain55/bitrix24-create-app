import { createWriteStream } from 'node:fs';
import { sep } from 'node:path';
import archiver from 'archiver';
import json from './package.json';

const archive = archiver('zip', { zlib: { level: 9 } });

archive.glob('**/*', {
  cwd: ['dist', json.name, 'browser'].join(sep),
  ignore: ['**/*.zip'],
});
archive.pipe(createWriteStream(['public', `${json.name}.zip`].join(sep)));
archive.finalize().catch(console.warn);
