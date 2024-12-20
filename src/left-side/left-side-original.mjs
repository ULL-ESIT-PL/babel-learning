//foo.assign(10, 9) Alternative, defining assignable functions.
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;

console.log(foo(4));   // 8
console.log(foo(10));  // 20