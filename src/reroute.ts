function addTitleIds(input: string) {
    let nameSet = new Set();
    let regex = /\<(h1|h2|h3)/g;
    return input.replace(regex, (h: string, p1, offset, string) => {
        var innerText = input.substr(offset + 4);
        var endXml = new RegExp('</' + p1);
        var foundEnd = endXml.exec(innerText);
        if (foundEnd) {
            innerText = innerText.substr(0, foundEnd.index);
        }

        var reps = 1;
        var idText = innerText.replace(/ /g, '-').toLowerCase().trim();
        while (nameSet.has(idText)) {
            idText = innerText.replace(/ /g, '-').toLowerCase().trim() + reps;
            reps++;
        }
        nameSet.add(idText);
        return h + ' id="' + idText + '"';
    });
}

function rerouteLinks(input: string, target: ((str: string) => string)) {
    let regex = /(href|src)\s*=\s*(?:\"|\')?\s*([^\"\'\/]+)(?:[^\"\']*)(?=(\"|\'))?/g;

    return addTitleIds(
        input.replace(regex, (link: string) => {
            // If there's an http(s) or ftp, don't modify
            if (link.match(/"(http(s?)|ftp):\/\//)) return link;

            // otherwise spilt string where the first " is.
            let split = link.split('"');

            if (!split[1]) return split[0] + '"';

            return split[0] + '"' + target(split[1]);
        })
    );
}

export default rerouteLinks;
