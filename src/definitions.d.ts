declare module "remarkable" {
  
  namespace Remarkable {

  }

  class Remarkable {
    constructor(config: { html: boolean, highlight: (str: string, lang: string) => string });

    render(str: string): string;
  }

  export = Remarkable;
}


type BibjSON = {
  [citation: string]: any
}