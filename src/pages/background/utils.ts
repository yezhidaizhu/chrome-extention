export function params(obj) {
  let arr = [];
  for (let objKey in obj) {
    arr.push(objKey + "=" + obj[objKey]);
  }
  return arr.join("&");
}

export function uid(len = 6) {
  return Math.random().toString(16).slice(-len);
}
