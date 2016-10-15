import test from 'ava';
import * as fs from 'fs';
import * as path from 'path';

import markademic from '../dist/markademic';


test((t) => {
  var compiled = markademic({
    input: fs.readFileSync(path.join(__dirname, 'notes.md')).toString(),
    rerouteLinks: (link) => path.join('https://alain.xyz/myblogpost/', link)
  });

  console.log(compiled);

  t.is(compiled, `<h1>Markademic</h1>                                                                                                         
<p>A markdown parser for academic articles, powered by <a href="https://github.com/jonschlinkert/remarkable">Remarkable</a>,
 <a href="http://okfnlabs.org/bibjson/">BibJSON</a>, <a href="https://khan.github.io/KaTeX/">Katex</a>, and <a href="http://
highlightjs.org">highlight.js</a>.</p>`);
});