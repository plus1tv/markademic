import test from 'ava';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { markademic } from '../dist/markademic';


test('Test Example', (t) => {
  var input = readFileSync(join(__dirname, 'notes.md'))
    .toString();

  var citations = JSON.parse(
    readFileSync(join(__dirname, 'references.json'))
      .toString());

  var symbols = JSON.parse(
    readFileSync(join(__dirname, 'symbols.json'))
      .toString());

  var compiled = markademic({
    input,
    rerouteLinks: (link) => join('https://alain.xyz/myblogpost/', link),
    citations,
    symbols
  });

  //Verify if latex compiled, tables were generated.
  writeFileSync('tests/out.html', compiled);

  var outFile = readFileSync(join(__dirname, 'out.html')).toString();

  t.is(compiled, outFile);
});