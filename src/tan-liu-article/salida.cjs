"use strict";

const currying = require("currying");

// '@@' makes the function `foo` curried
const foo = currying(function (a, b, c) {
  return a + b + c;
});
console.log(foo(1, 2)(3)); // 6
