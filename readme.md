# markademic

![Release][release-img]
[![License][license-img]][license-url]
[![Dependency Status][david-img]][david-url]
[![devDependency Status][david-dev-img]][david-dev-url]

A markdown parser for academic articles, powered by [Remarkable](https://github.com/jonschlinkert/remarkable), [BibJSON](http://okfnlabs.org/bibjson/), [Katex](https://khan.github.io/KaTeX/), and [highlight.js](http://highlightjs.org).

## Install

```bash
npm i markademic -S
```

## Usage

Make a config object literal of the following type:

```ts
type Config = {

  // Input markdown string
  input: string,

  // BibJSON file you're using in file.
  citations?: BibJSON,

  // Reroute any relative links
  rerouteLinks?: ((str: string) => string)

};
```

Then pass that config to the markademic default export to get back a string of html.

```js
import markademic from 'markademic';
import citations from './citations.json';
import fs from 'fs';
import path from 'path';

let config = {
  input: fs.readFileSync('./input.md').toString(),
  citations: require('./citations.json'),
  rerouteLinks: (link) => path.join('https://alain.xyz/myblogpost/', link)
}

let html = markademic(config);
```

## Markdown Additions

### Citations

```markdown
> I sometimes worry my life's work will be reduced to a 200-line @Shadertoy submission.[^timsweeny]
```

Similar to Latex References, to place references, simply write `[^yourrefname]`, and this will be matched with your configuration object's key of the same name (minus the `^`). (This is directly inspired by the same feature on [stackedit.io](https://stackedit.io)).

[cover-img]: assets/cover.gif
[cover-url]: http://codepen.io/alaingalvan/details/EgjbKP/
[release-img]: https://img.shields.io/badge/release-0.1.0-4dbfcc.svg?style=flat-square
[license-img]: http://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[david-url]: https://david-dm.org/stelatech/markademic
[david-img]: https://david-dm.org/stelatech/markademic.svg?style=flat-square
[david-dev-url]: https://david-dm.org/stelatech/markademic#info=devDependencies
[david-dev-img]: https://david-dm.org/stelatech/markademic/dev-status.svg?style=flat-square
[travis-img]: https://img.shields.io/travis/stelatech/markademic.svg?style=flat-square
[travis-url]:https://travis-ci.org/stelatech/markademic
[codecov-img]:https://img.shields.io/codecov/c/github/stelatech/markademic.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/stelatech/markademic
[npm-img]: https://img.shields.io/npm/v/markademic.svg?style=flat-square
[npm-url]: http://npm.im/markademic
[npm-download-img]: https://img.shields.io/npm/dm/markademic.svg?style=flat-square
