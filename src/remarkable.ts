import * as Remarkable from "remarkable";
const remark: any = Remarkable as any;
import hljs from "highlight.js";
const {
  getLanguage,
  highlight,
  highlightAuto,
  registerLanguage,
  registerAliases,
} = hljs;

import cpp from "./languages/cpp";
import glsl from "./languages/glsl";
import hlsl from "./languages/hlsl";
import msl from "./languages/msl";
import wgsl from "./languages/wgsl";

registerLanguage("cpp", cpp);
registerLanguage("glsl", glsl);
registerLanguage("hlsl", hlsl);
registerLanguage("msl", msl);
registerLanguage("wgsl", wgsl);

registerAliases(["asm", "amdil", "ptx"], { languageName: "x86asm" });

const remarkable = new remark.Remarkable({
  html: true,
  highlight: function (str, lang) {
    if (lang && getLanguage(lang)) {
      try {
        return highlight(str, { language: lang }).value;
      } catch (err) {
        console.error(err);
      }
    }

    try {
      return highlightAuto(str).value;
    } catch (err) {}

    return ""; // use external default escaping
  },
});

export default (str) => remarkable.render(str);
