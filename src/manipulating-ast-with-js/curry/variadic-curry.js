/* 
requirement: fn.length must be correctly defined. 
Does not work with variable arity functions. 

> const sum = (...x) => x.reduce((a,b) => a+b, 0)
undefined
> sum(1,2,3)
6
> f = curry(sum)
[Function (anonymous)]
> f(4,5)
[Function (anonymous)]

*/
module.exports = function curry(fn) {
  function nest(N, args) {
    return (...xs) => {
      if (N - xs.length === 0) {
        return fn(...args, ...xs);
      }

      return nest(N - xs.length, [...args, ...xs]);
    };
  }

  return nest(fn.length, []);
}
/*
const sum3 = curry((x, y, z) => x + y + z);

console.log(
  sum3(1, 2, 3),
  sum3(1, 2)(3),
  sum3(1)(2, 3),
  sum3(1)(2)(3),
);
*/