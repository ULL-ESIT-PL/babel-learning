let a = [1, 2, 3, else x => { if (x < 0) return a[a.length+x]; else return a[x]; }];

console.log(a[2]);   // 3
console.log(a[-1]);  // undefined but a[3+-1] = a[2] = 3