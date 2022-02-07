import * as Remarkable from "remarkable";
const remark: any = Remarkable as any;
import hljs from "highlight.js";
const { getLanguage, highlight, highlightAuto, registerLanguage, registerAliases } = hljs;
import hlsl from './languages/hlsl';

hljs.registerLanguage('hlsl', hlsl);
hljs.registerAliases('msl', {languageName: 'hlsl'});
hljs.registerAliases('wgsl', {languageName: 'glsl'});
hljs.registerAliases('asm', {languageName: 'x86asm'});

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
