# markademic

![Release][release-img]
[![License][license-img]][license-url]
[![Dependency Status][david-img]][david-url]
[![devDependency Status][david-dev-img]][david-dev-url]

A markdown parser with citation support, latex, and syntax highlighting, powered by Remarkable, BibJSON, Katex, and highlight.js.

## Install

```bash
npm i markademic -S
```

## Usage

```js
import markademic from 'markademic';
import citations from './citations.json';

let html = markademic('./readme.md', citations);
```

[cover-img]: assets/cover.gif
[cover-url]: http://codepen.io/alaingalvan/details/EgjbKP/
[release-img]: https://img.shields.io/badge/release-0.1.10-4dbfcc.svg?style=flat-square
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
