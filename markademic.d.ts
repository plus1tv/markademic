export type Config = {
  input: string, 
  citations?: any, 
  symbols?: {[latexSymbol: string]: {type: string, description: string}},
  rerouteLinks?: ((str: string) => string)
};

export default function markademic(config: Config);