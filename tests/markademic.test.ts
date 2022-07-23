import test from 'ava';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { markademic } from '../src/markademic';


test('Test Example', (t) => {
  var input = readFileSync(join(__dirname, 'notes.md'))
    .toString();

  var citations = JSON.parse(
    readFileSync(join(__dirname, 'references.json'))
      .toString());

  var compiled = markademic({
    input,
    rerouteLinks: (link) => join('https://alain.xyz/myblogpost/', link),
    citations
  });

  //Verify if latex compiled, tables were generated.
  //writeFileSync('tests/out.html', compiled);

  var outFile = readFileSync(join(__dirname, 'out.html')).toString();

  t.is(compiled, outFile);
});