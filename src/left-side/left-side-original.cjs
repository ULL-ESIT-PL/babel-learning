//foo.assign(10, 9) Alternative, defining assignable functions.
const foo = functionObject(function (bar) {
  return bar * 2;
});
assign(foo, 10, 5);
console.log(foo(4)); // 8

console.log(foo(10)); // 20
