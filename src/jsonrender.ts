import * as katex from 'katex';

type SymbolMap = {
	[latexSymbol: string]: {
		type: string;
		description: string;
	};
};

function symbolRender(input: string, symbols: SymbolMap) {
	let symbolTable =
		Object.keys(symbols)
			.map((key) => {
				let mathSymbol = symbols[key];

				var symbolRender = katex.renderToString(key);

				let row = `
<tr>
<td>
${symbolRender}
</td>
<td>
${mathSymbol.type}
</td>
<td>
${mathSymbol.description}
</td>
</tr>
`;

				return row;
			})
			.reduce((prev, cur) => prev + cur, '<table class="markademic-symbols">') + '</table>';

	return input + symbolTable;
}

function citationsRender(input: string, citations: BibjSON) {
	// Find all instances of [^${citename}].
	// Check if `citename` exists in citations object.
	// Replace with index number
	// Remove from input if it doesn't exist.
  let foundCitations: string[] = [];
  var cleanedCitationNames: string[] = [];

	input = input.replace(/\[\^\w*\]/g, (citekey) => {
		var citename = citekey.substr(2, citekey.length - 3);
		if (typeof citations[citename] !== undefined) {

      foundCitations = [ ...foundCitations, citename ];
      
      // Get author name to replace citation with
      // eg. [Smith et al. 2018]
      var authorName = `${foundCitations.length}`;
			var firstAuthor: string = citations[citename].author[0].name;
			var lastNameFirst = /^([^,]*),/.exec(firstAuthor);
			if (lastNameFirst) {
				authorName = lastNameFirst[0].substr(lastNameFirst[0].length - 1);
			} else {
        var lastNameLast = / .*$/.exec(firstAuthor);
        if(lastNameLast)
        {
          authorName = lastNameLast[0].substr(1, lastNameLast[0].length - 1);
        }
			}

			if (citations[citename].author.length > 1) {
        authorName += " et al."
      }

      if(citations[citename].year)
      {
        authorName += ` ${citations[citename].year}`;
      }
      cleanedCitationNames = [...cleanedCitationNames, authorName];

			return `<a href="#ref_${citename}">[${authorName}]</a>`;
		}
		return '';
	});

	// Generate Table and append to end of input
	let citationTable =
		foundCitations
			.map((citename, i) => {
				let citation = citations[citename];
				let { title, author, publisher, year } = citation;

				let row = `
<tr>
<td id="ref_${citename}">
<a id="ref_${citename}" href="${citation.link[0].url}">
[${cleanedCitationNames[i]}]<br>
<em><strong>${title}</strong></em><br>
${author[0].name}<br>
${publisher ? `${citation.publisher} ${citation.year}` : ''}.
</a>
</td>
</tr>
`;

				return row;
			})
			.reduce((prev, cur) => prev + cur, '<table class="markademic-citations">') + '</table>';

	return input + citationTable;
}

export { symbolRender, citationsRender };
