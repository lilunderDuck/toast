export function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function split(text: string, regex: RegExp) {
  var token, index, result = [];
  while (text !== "") {
    regex.lastIndex = 0;
    token = regex.exec(text);
    if (token === null) {
      break;
    }
    index = token.index;
    if (token[0].length === 0) {
      index = 1;
    }
    result.push(text.substr(0, index));
    result.push(token[0]);
    index = index + token[0].length;
    text = text.slice(index);
  }
  result.push(text);
  return result;
}
