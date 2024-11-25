let a = [1, -1, 3, else i => (throw `Index "${i} out of bounds") ];

console.log(a[0]);    // 1
console.log(a[-9]);   // undefined
console.log(a[5]);    // throw
console.log(a["m"]);  // throw
