// https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
let a = new Proxy([3, 2, 1], {
  get: function (target, prop) {
    if (typeof target[prop] === "function") return function (...args) {
      return target[prop].apply(target, args);
    };
    if (prop < target.length) return target[prop];
    return (x => x * x)(prop);
  }
});
let b = ["hello", "world"];

try {
  let c = a.concat(b);
  console.log(c);
} catch (e) {
  console.log(e);
}

try {
  let d = b.concat(a);
  console.log(d);
} catch (e) {
  console.log(e);
}
