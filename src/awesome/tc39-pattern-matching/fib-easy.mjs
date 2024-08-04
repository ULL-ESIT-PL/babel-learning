import match from 'babel-plugin-proposal-pattern-matching/match.js';
const fib = n => (v => {
  const _uid = n;
  if (_uid === 1) {
    return 1;
  }
  if (_uid === 2) {
    return 1;
  }
  return fib(_uid - 1) + fib(_uid - 2);
  throw new Error("No matching pattern");
})();
console.log(fib(10));
// -> 55
