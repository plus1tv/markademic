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
    // 🔍 Find all instances of [^${citename}].
    // Check if `citename` exists in citations object.
    // Remove from input if it doesn't exist.
    let foundCitations: string[] = [];
    var cleanedCitationNames: string[] = [];

    input = input.replace(/\[\^\w*\]/g, (citekey) => {
        var citename = citekey.substr(2, citekey.length - 3);
        if (citename in citations) {
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
                if (lastNameLast) {
                    authorName = lastNameLast[0].substr(1, lastNameLast[0].length - 1);
                }
            }

            if (citations[citename].author.length > 1) {
                authorName += ' et al.';
            }

            if (citations[citename].year) {
                authorName += ` ${citations[citename].year}`;
            }
            cleanedCitationNames = [ ...cleanedCitationNames, authorName ];

            return `<a href="#ref_${citename}">[${authorName}]</a>`;
        }
        return '';
    });

    // ❌ Don't generate citation table if there are none.
    if (foundCitations.length == 0) {
        return input;
    }

    // 🔲 Generate Table and append to end of input
    let citationTable =
        foundCitations
            .map((citename, i) => {
                let citation = citations[citename];
                let { title = '', author = [], publisher = '', journal = '', year = 0, link = [] } = citation;

                let citationName = `[${cleanedCitationNames[i]}]<br>`;
                let tableTitle = title.length > 0 ? `<em><strong>${title}</strong></em><br>` : '';
                let authorNames = author.reduce(
                    (prev, cur, i) =>
                        prev + ( cur['name'] ? (i >= 1 ? (i == author.length - 1 ? ' and ' : ', ') : '') + cur['name'] : '' ),
                    ''
                );
                if (authorNames.length > 0) {
                    authorNames += '<br>';
                }
                let publisherJournalEtc = '';
                if (publisher.length > 0) {
                    publisherJournalEtc += publisher;
				}
                if (journal.length > 0) {
					if (publisherJournalEtc.length > 0) {
						publisherJournalEtc += ', ';
					}
                    publisherJournalEtc += journal;
                }
                if (publisherJournalEtc.length > 0) {
                    publisherJournalEtc += ' ';
                }
                if (year > 0) {
                    publisherJournalEtc += year;
                }
                if (publisherJournalEtc.length > 0) {
                    publisherJournalEtc += '<br>';
                }

                let citationLinks = '';
                if (link.length > 0) {
                    citationLinks = link.reduce((prev, cur) => {
                        var cleanLink = cur['url'];
                        if (!cleanLink) {
                            cleanLink = '';
                        }
                        let rem = /(http|ftp|https):\/\/(www\.)?/.exec(cleanLink);
                        if (rem) {
                            cleanLink = cleanLink.slice(rem[0].length);
                        }
                        let nextSlash = /\//.exec(cleanLink);
                        if (nextSlash) {
                            cleanLink = cleanLink.slice(0, nextSlash.index);
                        }
                        return prev + cur['url']
                            ? (i > 1 ? ' ' : '') +
                              `<a href="${cur['url']}">${cur['title'] ? cur['title'] : cleanLink}</a>`
                            : '';
                    }, '');
                }
                console.log(citationLinks);

                let row = `
<tr>
<td id="ref_${citename}">
${citationName}
${tableTitle}
${authorNames}
${publisherJournalEtc}
${citationLinks}
</td>
</tr>
`;

                return row;
            })
            .reduce((prev, cur) => prev + cur, '<table class="markademic-citations">') + '</table>';

    return input + citationTable;
}

export { symbolRender, citationsRender };
