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
import hlsl from "./languages/hlsl";
import cpp from "./languages/cpp";
import wgsl from "./languages/wgsl";
registerLanguage("hlsl", hlsl);
registerLanguage("cpp", cpp);
registerLanguage("wgsl", wgsl);
registerAliases(["asm", "amdil", "ptx"], { languageName: "x86asm" });
registerAliases("msl", { languageName: "cpp" });

const remarkable = new remark.Remarkable({
  html: true,
  highlight: function (str, lang) {
    if (lang && getLanguage(lang)) {
      try {
        return highlight(str, { language: lang }).value;
      } catch (err) {}
    }

    try {
      return highlightAuto(str).value;
    } catch (err) {}

    return ""; // use external default escaping
  },
});

export default (str) => remarkable.render(str);
