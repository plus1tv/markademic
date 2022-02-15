import * as md5 from "md5";

type BibJSON = {
  [citation: string]: any;
};

type SymbolMap = {
  [latexSymbol: string]: {
    type: string;
    description: string;
  };
};

function citationsRender(input: string, citations: BibJSON) {
  // 🔍 Find all instances of [^${citename}].
  // Check if `citename` exists in citations object.
  // Remove from input if it doesn't exist.
  let foundCitations: string[] = [];
  var cleanedCitationNames: string[] = [];
  var foundCitationsSet = new Set<string>();

  input = input.replace(/\[\^\w*\]/g, (citekey) => {
    var citename = citekey.substr(2, citekey.length - 3);
    if (citename in citations) {
      let curCitation = citations[citename];
      if(curCitation === undefined)
      {
        return "";
      }
      // 🧼 Get author name to replace citation with
      // eg. [Smith et al. 2018]
      // Default to the publisher first.
      var authorName = curCitation?.publisher || "";
      if (curCitation?.author?.length > 0) {
        var firstAuthor: string = curCitation.author[0].name;
        var lastNameFirst = /^([^,]*),/.exec(firstAuthor);
        if (lastNameFirst) {
          authorName = lastNameFirst[0].substr(lastNameFirst[0].length - 1);
        } else {
          var lastNameLast = / .*$/.exec(firstAuthor);
          if (lastNameLast) {
            authorName = lastNameLast[0].substr(1, lastNameLast[0].length - 1);
          }
        }

        if (curCitation.author.length > 1) {
          authorName += " et al.";
        }
      }
      if (curCitation.year) {
        authorName += ` ${citations[citename].year}`;
      }

      // Don't add to table if it already exists
      let citationExists = foundCitationsSet.has(citename);
      if (!citationExists) {
        foundCitationsSet.add(citename);
        foundCitations = [...foundCitations, citename];
        cleanedCitationNames[citename] = authorName;
      }

      return `<a href="#ref_${citename}">[${authorName}]</a>`;
    }
    return "";
  });

  // ❌ Don't generate citation table if there are none.
  if (foundCitations.length == 0) {
    return input;
  }

  // 🔲 Generate Table and append to end of input
  let citationTable =
    foundCitations
      .map((citename) => {
        let citation = citations[citename];
        let {
          title = "",
          author = [],
          publisher = "",
          journal = "",
          year = 0,
          link = [],
        } = citation;

        let citationName = `<span class="markademic-citename">[${cleanedCitationNames[citename]}]</span><br>`;
        let tableTitle =
          title.length > 0
            ? `<em><strong><span class="markademic-title">${title}</span></strong></em><br>`
            : "";
        let authorNames = author.reduce((prev, cur, i) => {
          let authorHTML = "";
          /*
                        (prev, cur, i) =>
                        prev +
                        (cur['name'] ? (i >= 1 ? (i == author.length - 1 ? ' and ' : ', ') : '') + cur['name'] : ''),*/
          if (cur["name"]) {
            // Ands, Commas:
            if (i >= 1) {
              if (i == author.length - 1) {
                authorHTML += " and ";
              } else {
                authorHTML += ", ";
              }
            }
            // Author Profile
            let authorWebsite = "";
            if (cur["github"]) {
              let imgUrl = cur["github"] + ".png";
              authorHTML += `<img class="markademic-profile" src="${imgUrl}"> `;
              authorWebsite = cur["github"];
            } else if (cur["email"]) {
              let hash = md5(
                "MyEmailAddress@example.com ".trim().toLocaleLowerCase()
              );
              let imgUrl = "https://www.gravatar.com/avatar/" + hash;
              authorHTML += `<img class="markademic-profile" src="${imgUrl}"> `;
              authorWebsite = `mailto:${cur["email"]}`;
            }

            // Author Name
            if (cur["website"]) {
              authorWebsite = cur["website"];
            }
            if (authorWebsite.length > 0) {
              authorHTML += `<a href="${authorWebsite}">${cur["name"]}</a>`;
            } else {
              authorHTML += cur["name"];
            }

            if (cur["twitter"]) {
              let twitterUrl = "";
              let twitterHandle = "";

              try {
                //if its a url, extract handle
                if (new URL(cur["twitter"])) {
                  let reg = /\.com\//.exec(cur["twitter"]);
                  if (reg) {
                    twitterHandle = cur["twitter"].slice(
                      reg.index + ".com/".length
                    );
                  }
                  twitterUrl = cur["twitter"];
                }
              } catch (e) {
                //if its a handle, extract handle without @
                let reg = /@/.exec(cur["twitter"]);
                if (reg) {
                  twitterHandle = cur["twitter"].slice(reg.index + "@".length);
                } else if (cur["twitter"].length > 0) {
                  twitterHandle = cur["twitter"];
                }
                twitterUrl = "https://twitter.com/" + twitterHandle;
              }

              authorHTML += ` (<a href="${twitterUrl}">@${twitterHandle}</a>)`;
            }
          }
          return prev + authorHTML;
        }, "");
        if (authorNames.length > 0) {
          authorNames =
            '<span class="markademic-authors">' + authorNames + "</span><br>";
        }
        let publisherJournalEtc = "";
        if (publisher.length > 0) {
          publisherJournalEtc += publisher;
        }
        if (journal.length > 0) {
          if (publisherJournalEtc.length > 0) {
            publisherJournalEtc += ", ";
          }
          publisherJournalEtc += journal;
        }
        if (publisherJournalEtc.length > 0) {
          publisherJournalEtc += " ";
        }
        if (year > 0) {
          publisherJournalEtc += year;
        }
        if (publisherJournalEtc.length > 0) {
          publisherJournalEtc =
            '<span class="markademic-publisher">' +
            publisherJournalEtc +
            "</span><br>";
        }

        let citationLinks = "";
        if (link.length > 0) {
          citationLinks = link.reduce((prev, cur, i) => {
            var cleanLink = cur["url"];
            if (!cleanLink) {
              cleanLink = "";
            }
            let rem = /(http|ftp|https):\/\/(www\.)?/.exec(cleanLink);
            if (rem) {
              cleanLink = cleanLink.slice(rem[0].length);
            }
            let nextSlash = /\//.exec(cleanLink);
            if (nextSlash) {
              cleanLink = cleanLink.slice(0, nextSlash.index);
            }
            return (
              prev +
              (cur["url"]
                ? (i >= 1 ? " " : "") +
                  `<a href="${cur["url"]}">${
                    cur["title"] ? cur["title"] : cleanLink
                  }</a>`
                : "")
            );
          }, "");
        }

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
      .reduce(
        (prev, cur) => prev + cur,
        '<table class="markademic-citations">'
      ) + "</table>";

  return input + citationTable;
}

export { citationsRender };
