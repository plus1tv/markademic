# Markademic

[![Npm Package][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Unit Tests][travis-img]][travis-url]
[![Coverage Tests][codecov-img]][codecov-url]

```bash
npm i markademic -S
```

A tool for rendering academically flavored markdown.

## Features

- 😲 Markdown rendering powered by [Remarkable](https://github.com/jonschlinkert/remarkable).

- 👥 Citation support following the [BibJSON](http://okfnlabs.org/bibjson/) specification.

- 🔣 Symbol definition support for cases where you want to define the meaning of a math symbol used in a formula.

- 🧤 LaTeX rendering support with [Katex](https://khan.github.io/KaTeX/).

- 🖊️ Syntax highlighting for 170 languages powered by [highlight.js](http://highlightjs.org).

- 🌠 Reroute relative links for publishing to different platforms or syncing your output with the permalink of your website.

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

## Markdown Additions

### Citations

```markdown
> I sometimes worry my life's work will be reduced to a 200-line @Shadertoy submission [^timsweeny].
```

becomes:

> I sometimes worry my life's work will be reduced to a 200-line @Shadertoy submission [[Sweeny 2015]](#sweeny2015).

Similar to Latex References, to place references, simply write `[^yourrefname]`, and this will be matched with your BibJSON object's key of the same name (minus the `^`). (This is directly inspired by the same feature on [stackedit.io](https://stackedit.io)). This uses the [BibJSON specification](https://github.com/plus1tv/bibtex-bibjson), which is just a JSON version of common LaTeX bibliographies.

On the bottom of your markdown file there will be some automatically generated references that look like this:

| References     |
|:---------------|
| [Gregory 2014]<br>**_Game Engine Architecture, Second Edition._**<br>Gregory, Jason<br>CRC Press, 2014. |
| [Moller et al. 2008]<br>**_Real Time Rendering, Third Edition._**<br>Akenine-Moller, Thomas<br>CRC Press, 2008. |

#### Social Connections

Often times authors provide some means of contacting them, either via [Twitter](https://twitter.com/alainxyz), [GitHub](https://github.com/alaingalvan), [LinkedIn](https://linkedin.com/in/alaingalvan), Discord, Zoom, Email, etc. If you enter in their social media information in the `author` object, it can be displayed more prominently by Markademic:

```json
{
  "satran2018": {
    "title": "Fence-Based Resource Management",
    "author": [
      {
      "name": "Michael Satran",
      "github": "https://github.com/msatranjr"
      },
      {
        "name": "Steven White",
        "github": "https://github.com/stevewhims"
      }
      ],
    "year": 2018,
    "publisher": "Microsoft",
    "link": [
      {
        "url": "https://docs.microsoft.com/en-us/windows/win32/direct3d12/fence-based-resource-management"
      }
    ]
  }
}
```

Since the authors each have a GitHub account, this can be used to get their profile picture.

Alternatively, emails can be queried by common community profile picture tools like [Gravatar](https://en.gravatar.com/site/implement/images/).

These will be displayed by markademic as so: `<ProfilePicture/> <AuthorName href="{authorWebsite}"/> (@<TwitterHandle/>)`.

```ts
type BibTexAuthor =
{
  name: string,
  website?: string,
  github?: string,
  twitter?: string,
  email?: string
}
```

### LaTeX

Latex is a markup language that's really suited for writing math equations:

```tex
\gamma = \mu \chi + \beta
```

becomes:

<img src="https://latex.codecogs.com/png.latex?\gamma&space;=&space;\mu&space;\chi&space;&plus;&space;\beta" title="\gamma = \mu \chi + \beta" />

Easily describe mathematical proofs, formulas, or formalize some algorithms. Marademic features a latex parser as well as a `symbols` config parameter where you can specify what the symbols used in your document mean. Then on the bottom of the page just before references, this will appear *(formatted of course!)*.

| Symbol        | Type               | Description                     |
|:--------------|:-------------------|:--------------------------------|
| <img src="https://latex.codecogs.com/png.latex?\(&space;\hat{n}&space;\)" title="\( \hat{n} \)" /> | <img src="https://latex.codecogs.com/png.latex?\(&space;\mathbb{R}^2&space;\)" title="\( \mathbb{R}^2 \)" /> | Normal to surface point X |

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
[travis-img]: https://img.shields.io/travis/plus1tv/markademic.svg?style=flat-square
[travis-url]:https://www.travis-ci.com/github/plus1tv/markademic
[codecov-img]:https://img.shields.io/codecov/c/github/plus1tv/markademic.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/plus1tv/markademic
[npm-img]: https://img.shields.io/npm/v/markademic.svg?style=flat-square
[npm-url]: http://npm.im/markademic
[npm-download-img]: https://img.shields.io/npm/dm/markademic.svg?style=flat-square
