function symbolRender(input: string, symbols: Object) {
  return input;
}

function citationsRender(input: string, citations: BibjSON) {
  return Object.keys(citations)
    .map((k) => {
      let citation = citations[k];
      let {title, author, publisher, year} = citation;
      
      let row =
        `
      <tr>
      <td>
      [${k}]<br>
      <b><i>${title}</i></b><br>
      ${author[0]}<br>
      ${(publisher) ? `${citation.publisher} ${citation.year}` : ''}.
      </td>
      </tr>
      `;

      return row;
    })
    .reduce((p, c) => {
      return p + c;
    }, '<table class="bibliography">') + '</table>';

}

export { symbolRender, citationsRender };