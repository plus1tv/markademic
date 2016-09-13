import * as katex from 'katex';

/**
 * A Katex wrapper class.
 * A port of RocketChat's katex class.
 */
class Katex {
  public delimiterMap = [
    {
      opener: '\\[',
      closer: '\\]',
      displayMode: true
    }, {
      opener: '\\(',
      closer: '\\)',
      displayMode: false
    }
  ];

  findOpeningDelimiter = (str: string, start: number) => {
    var m, match, matchIndex, o, pos,
      positions: any[] = [],
      matches: any[] = [];

    // Iterate on delimiterMap
    this.delimiterMap.map((d) =>
      matches.push({
        options: d,
        pos: str.indexOf(d.opener, start)
      })
    );

    matches.map((m) =>
      (m.pos >= 0) ? positions.push(m.pos) : null
    );



    if (positions.length === 0) {
      return null;
    }

    pos = Math.min.apply(Math, positions);
    matchIndex = (() => {
      var i, len, results;
      results = [];
      for (i = 0, len = matches.length; i < len; i++) {
        m = matches[i];
        results.push(m.pos);
      }
      return results;
    })().indexOf(pos);

    match = matches[matchIndex];
    return match;
  }

  getLatexBoundaries = (str, openingDelimiterMatch) => {
    var closer, closerIndex, inner, outer;
    inner = new Boundary;
    outer = new Boundary;
    closer = openingDelimiterMatch.options.closer;
    outer.start = openingDelimiterMatch.pos;
    inner.start = openingDelimiterMatch.pos + closer.length;
    closerIndex = str.substr(inner.start).indexOf(closer);
    if (closerIndex < 0) {
      return null;
    }
    inner.end = inner.start + closerIndex;
    outer.end = inner.end + closer.length;
    return {
      outer,
      inner
    };
  }

  findLatex = (str) => {
    var match, openingDelimiterMatch, start;
    start = 0;
    while ((openingDelimiterMatch = this.findOpeningDelimiter(str, start++)) != null) {
      match = this.getLatexBoundaries(str, openingDelimiterMatch);
      if (match != null ? match.inner.extract(str).trim().length : void 0) {
        match.options = openingDelimiterMatch.options;
        return match;
      }
    }
    return null;
  }

  extractLatex = (str, match) => {
    var after, before, latex;
    before = str.substr(0, match.outer.start);
    after = str.substr(match.outer.end);
    latex = match.inner.extract(str);
    return {
      before,
      latex,
      after
    };
  }

  renderLatex = (latex, displayMode) => {
    var displayMode, e, error, rendered;
    try {
      rendered = katex.renderToString(latex, {
        displayMode
      });
    } catch (error) {
      e = error;
      displayMode = displayMode ? "block" : "inline";
      rendered = `<div class="katex-error katex-${displayMode}-error">${e.message}</div>`
    }
    return rendered;
  }

  render = (str) => {
    var match, parts, rendered, result;
    result = '';
    while (true) {
      match = this.findLatex(str);
      if (match == null) {
        result += str;
        break;
      }
      parts = this.extractLatex(str, match);
      rendered = this.renderLatex(parts.latex, match.options.displayMode);
      result += parts.before + rendered;
      str = parts.after;
    }
    return result;
  }



}

class Boundary {
  public end: number;
  public start: number;
  length() {
    return this.end - this.start;
  }

  extract(str: string) {
    return str.substr(this.start, this.length());
  }
}

const katexRender = new Katex();

export default (str) => katexRender.render(str);