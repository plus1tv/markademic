declare module "remarkable" {
  
  namespace Remarkable {

  }

  class Remarkable {
    constructor(config: { html: boolean, highlight: (str: string, lang: string) => string });

    render(str: string): string;
  }

  export = Remarkable;
}

declare module "highlight.js" {
  namespace hl {
    export function getLanguage(lang: string): boolean;

    export function highlight(lang: string, str: string): { value: string };

    export function highlightAuto(str): { value: string };
  }

  export = hl;
}
