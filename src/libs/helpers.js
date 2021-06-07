export function randomId(idSize) {
  const str = "" + Math.random();
  return str.substr(2, idSize);
}

export function cloneJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function saveToLS(varName, value, stringify = true) {
  const val = stringify ? JSON.stringify(value) : value;
  return localStorage.setItem(varName, val);
}

export function getFromLS(varName, parse = true) {
  const val = localStorage.getItem(varName);
  return parse && val !== null ? JSON.parse(val) : val;
}

export function findIndexBy(coll, fieldName, fieldValue) {
  let index = -1;
  for (let i = 0; i < coll.length; i++) {
    if (coll[i][fieldName] === fieldValue) {
      index = i;
      break;
    }
  }
  return index;
}

export function createId(size = 5) {
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < size; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
