import { defineMacro } from "vite-plugin-macro";

export const genSVGCubicBezier = defineMacro('macro_generateSVGCubicBezier')
  .withSignature("(keySplines: string)")