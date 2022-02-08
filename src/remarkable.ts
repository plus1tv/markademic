import * as Remarkable from "remarkable";
const remark: any = Remarkable as any;
import hljs from "highlight.js";
const { getLanguage, highlight, highlightAuto, registerLanguage, registerAliases } = hljs;
import hlsl from './languages/hlsl';
import cpp from './languages/cpp';
import wgsl from './languages/wgsl';
hljs.registerLanguage('hlsl', hlsl);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('wgsl', wgsl);
hljs.registerAliases('asm', {languageName: 'x86asm'});
hljs.registerAliases('msl', {languageName: 'cpp'});

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
