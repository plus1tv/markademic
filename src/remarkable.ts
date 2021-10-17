import * as Remarkable from 'remarkable';
const remark: any = Remarkable as any;
import hljs from "highlight.js";
const { getLanguage, highlight, highlightAuto } = hljs;

const remarkable = new remark.Remarkable({
  html: true,
  highlight: function (str, lang) {
    if (lang && getLanguage(lang)) {
      try {
        return highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return highlightAuto(str).value;
    } catch (err) {}

    return ""; // use external default escaping
  },
});

export default (str) => remarkable.render(str);
