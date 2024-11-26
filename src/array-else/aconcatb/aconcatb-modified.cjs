// https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

let a = new Proxy([3, 2, 1], {
  [Symbol.isConcatSpreadable]: true,
  length: 3,
  get: function (target, prop) {
    if (typeof prop === "symbol" && prop === Symbol.isConcatSpreadable) {
      console.error("prop:", prop);
      return true;
    }
    if (typeof target[prop] === "function") return function (...args) {
      return target[prop].apply(target, args);
    };
    if (typeof prop === "string") return target[prop];
    console.error("prop:", prop, "typeof prop:", typeof prop);
    if (isNumeric(prop) && prop < target.length) return target[prop];
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
  console.log("Error in d = b.concat(a):", e.message);
}
