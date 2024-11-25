let a = [1, -1, 3, else function(i) { throw `Index "${i}"· out of bounds` } ];

console.log(a[0]);    // 1
console.log(a[-9]);   // undefined

try { console.log(a["m"]); } catch (e) { console.log(e); }  // Index "m"· out of bounds

try { console.log(a[9]); } catch (e) { console.log(e); }  // Index "9"· out of bounds
