export function debounce(fn, wait) {
  let timeout = null;
  return function() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  };
}

export function toArray(_arr) {
  return _arr.length ? Array.prototype.concat.apply([], _arr) : false;
}

