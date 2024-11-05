import match from 'babel-plugin-proposal-pattern-matching/match.js'
const fib = n=>match(n)(
        (n=1)=>1,
        (n=2)=>1,
        n=>fib(n - 1)+fib(n - 2)
)

console.log(fib(10))
// -> 55