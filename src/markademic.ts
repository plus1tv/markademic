import remarkableRender from './remarkable';
import katexRender from './katex';
import rerouteLinks from './reroute';

export type Config = {
  input: string, 
  citations: any, 
  rerouteLinks: ((str: string) => string)
};

/**
 * Processes Markdown with Syntax Highlighting 
 * and Latex Preprocessors, and adds references.
 */
function markademic(config: Config) {
  
  let out = katexRender(config.input);

  out = remarkableRender(out);

  out = rerouteLinks(out, config.rerouteLinks);

  return out;
}

export default markademic;
