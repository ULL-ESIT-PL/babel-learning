// '@@' makes the function `foo` curried
function @@ currying(a, b, c) {
  return a + b + c;
}
console.log(currying(1, 2)(3)); // 6