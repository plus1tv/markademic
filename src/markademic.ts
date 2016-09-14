import rrender from './remarkable';
import krender from './katex';
import * as path from 'path';

export type Config = {
  input: string, 
  citations: any, 
  rerouteLinks: ((str: string) => string)
};

/**
 * Processes Markdown with Syntax Highlighting 
 * and Latex Preprocessors, and adds references.
 */
function renderMarkdown(config: Config) {
  
  // Find Latex and compile it.
  let out: string = krender(config.input);
  // Find relative links and prepend them with path.
  out = rrender(out);
  out = out.replace(/(href|src)\s*=\s*(?:\"|\')?\s*([^\"\'\/]+)(?:[^\"\']*)(?=(\"|\'))?/g, (link: string) => {

    // If there's an http(s) or ftp, don't modify
    if (link.match(/"(http(s?)|ftp):\/\//)) return link;
    // otherwise spilt string where the first " is.
    let split = link.split('"');
    //
    return split[0] + '"' + path.join(config.rerouteLinks, (split[1]) ? split[1] : '');
  });

  return out;
}

export default renderMarkdown;
