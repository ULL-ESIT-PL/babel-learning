// https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
let a = [3,2,1, else x => x*x ];
let b = ["hello", "world"];
try { 
    let c = a.concat(b);
    console.log(c);
} catch (e) {
    console.log(e);
}

try { 
    let d = b.concat(a);
    console.log(d);
} catch (e) {
    console.log(e);
}
