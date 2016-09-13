import rrender from './remarkable';
import krender from './katex';
import * as path from 'path';

/**
 * Processes Markdown with Syntax Highlighting 
 * and Latex Preprocessors, and adds references.
 */
export function renderMarkdown(str: string, pth: string, ref?: any) {
  // Find Latex and compile it.
  let out: string = krender(str);
  // Find relative links and prepend them with path.
  out = rrender(out);
  out = out.replace(/(href|src)\s*=\s*(?:\"|\')?\s*([^\"\'\/]+)(?:[^\"\']*)(?=(\"|\'))?/g, (link: string) => {

    // If there's an http(s) or ftp, don't modify
    if (link.match(/"(http(s?)|ftp):\/\//)) return link;
    // otherwise spilt string where the first " is.
    let split = link.split('"');
    //
    return split[0] + '"' + path.join(pth, (split[1]) ? split[1] : '');
  });

  return out;
}
