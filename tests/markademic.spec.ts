import test from 'ava';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

import markademic from '../src/markademic';


test((t) => {
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

  t.is(compiled, readFileSync(join(__dirname, 'out.html')).toString());
});