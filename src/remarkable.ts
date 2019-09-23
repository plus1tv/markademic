import * as Remarkable from 'remarkable';
import * as hljs from 'highlight.js';

var remark: any = Remarkable as any;

const remarkable = new remark.Remarkable({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) { }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) { }

    return ''; // use external default escaping
  }
});

export default (str) => remarkable.render(str);

