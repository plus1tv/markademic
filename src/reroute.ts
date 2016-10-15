function rerouteLinks(input: string, target: ((str: string) => string)) {

  let regex = /(href|src)\s*=\s*(?:\"|\')?\s*([^\"\'\/]+)(?:[^\"\']*)(?=(\"|\'))?/g;

  return input.replace(regex, (link: string) => {

    // If there's an http(s) or ftp, don't modify
    if (link.match(/"(http(s?)|ftp):\/\//)) return link;

    // otherwise spilt string where the first " is.
    let split = link.split('"');

    if (!split[1])
      return split[0] + '"';

    return split[0] + '"' + target(split[1]);
  });
}

export default rerouteLinks;