function symbolRender(input: string, symbols: Object) {
  return input;
}

function citationsRender(input: string, citations: BibjSON) {

  // Find all instances of [^${citename}].
  // Check if `citename` exists in citations object.
  // Replace with index number
  // Remove from input if it doesn't exist.
  let foundCitations: string[] = [];

  input = input.replace(/\[\^\w*\]/, (citekey) => {
    var citename = citekey.substr(2, citekey.length-3);
    if (typeof citations[citename] !== undefined) {
      foundCitations = [...foundCitations, citename];
      return `[${foundCitations.length}]`;
    }
    return '';
  });

  // Generate Table and append to end of input
  let citationTable = foundCitations
    .map((citename) => {
      let citation = citations[citename];
      let {title, author, publisher, year} = citation;

      let row =
        `
      <tr>
      <td>
      [${citename}]<br>
      <b><i>${title}</i></b><br>
      ${author[0].name}<br>
      ${(publisher) ? `${citation.publisher} ${citation.year}` : ''}.
      </td>
      </tr>
      `;

      return row;
    })
    .reduce((prev, cur) => prev + cur,
    '<table class="bibliography">') + '</table>';

    return input + citationTable;
}

export { symbolRender, citationsRender };