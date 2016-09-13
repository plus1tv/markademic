# markademic

[![Npm Package][npm-img]][npm-url]
[![Travis CI][travis-img]][travis-url]
![Release][release-img]
[![License][license-img]][license-url]
[![Codecov][codecov-img]][codecov-url]
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
[david-url]: https://david-dm.org/alaingalvan/react-anime
[david-img]: https://david-dm.org/alaingalvan/react-anime.svg?style=flat-square
[david-dev-url]: https://david-dm.org/alaingalvan/react-anime#info=devDependencies
[david-dev-img]: https://david-dm.org/alaingalvan/react-anime/dev-status.svg?style=flat-square
[travis-img]: https://img.shields.io/travis/stelatech/react-anime.svg?style=flat-square
[travis-url]:https://travis-ci.org/alaingalvan/react-anime
[codecov-img]:https://img.shields.io/codecov/c/github/alaingalvan/react-anime.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/alaingalvan/react-anime
[npm-img]: https://img.shields.io/npm/v/react-anime.svg?style=flat-square
[npm-url]: http://npm.im/react-anime
[npm-download-img]: https://img.shields.io/npm/dm/react-anime.svg?style=flat-square
