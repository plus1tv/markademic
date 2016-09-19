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

  // Symbols used in formulas.
  symbols?: {[latexSymbol: string]: {type: string, description: string}},

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
  symbols: require('./symbols.json'),
  rerouteLinks: (link) => path.join('https://alain.xyz/myblogpost/', link)
}

let html = markademic(config);
```

In your project you will need the katex css files, as well as highlight.js css files. 

## features

- Citation support following the BibJSON specification.
- Symbol definitions for LaTex math expressions.
- Syntax highlighting for 170 languages powered by highlight.js
- Reroute relative links for publishing to different platforms or syncing your output with the permalink of your website.
- Tooltip support powered by hint.css.

## Markdown Additions

### Citations

```markdown
> I sometimes worry my life's work will be reduced to a 200-line @Shadertoy submission.[^timsweeny]
```

Similar to Latex References, to place references, simply write `[^yourrefname]`, and this will be matched with your BibJSON object's key of the same name (minus the `^`). (This is directly inspired by the same feature on [stackedit.io](https://stackedit.io)).

On the bottom of your markdown file there will be some autoamtically generated references that look like this:

| References     |
|:---------------|
| [gregory2014]<br>**_Game Engine Architecture, Second Edition._**<br>Gregory, Jason<br>CRC Press, 2014. |
| [moller2008]<br>**_Real Time Rendering, Third Edition._**<br>Akenine-Moller, Thomas<br>CRC Press, 2008. |

### LaTex

Latex is a markup language that's really suited for writing math equations:

```tex
\gamma = \mu \chi + \beta
```

Easily describe mathematical proofs, formulas, or formalize some algorithms. Marademic features a latex parser as well as a `symbols` config parameter where you can specify what the symbols used in your document mean. Then on the bottom of the page just before references, this will appear *(formatted of course!)*.

| Symbol        | Type               | Description                     |
|:--------------|:-------------------|:--------------------------------|
| \( \hat{n} \) | \( \mathbb{R}^2 \) | Normal to surface point \( X \) |

Inspired by the same feature in [The Graphics Codex](http://grahpicscodex.com).

### Syntax Highlighting

```glsl
vec4 integrate( in vec4 sum, in float dif, in float density, in vec3 bgcol, in float time )
{
    //Colors
    vec3 gray = vec3(0.65);
    vec3 lightgray = vec3(1.0,0.95,0.8);
    vec3 bluegray = vec3(0.65,0.68,0.7);
    vec3 orangegray =  vec3(0.7, 0.5, 0.3);

    //Density Colors
    vec4 col = vec4( mix( 1.15 * lightgray, gray, density ), density );
    vec3 lin =  (1.3 * bluegray) + (0.5 * orangegray * dif);
    col.xyz *= lin;
    col.xyz = mix( col.xyz, bgcol, 1.0 - exp(-0.003*time*time) );

    //Front to Back Blending
    col.a *= 0.4;
    col.rgb *= col.a;
    return sum + col*(1.0 - sum.a);
}
```

The same syntax highlighting featured in Github flavored markdown, [odds are it supports your language (170 and counting!)](https://highlightjs.org/static/demo/).

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
