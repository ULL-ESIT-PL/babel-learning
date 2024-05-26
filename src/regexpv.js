let r = /[\p{ASCII}&&\p{Decimal_Number}]/v
let b = r.test('1') // true
console.log(b)