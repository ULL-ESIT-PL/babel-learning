# Add Complex Numbers to Babel

Here is a challenge for you in the TC39 discourse group:

* See [imaginary number : i](https://es.discourse.group/t/imaginary-number-i/1032)

Change the proposal in the referenced discussion to fit this simpler API:

```js
const i = Complex("i");

let a = Complex(1) + i;
let b = Complex(2) + 2i;
let c = a + b; // 3 + 3i
let d = a * b; //  4i

Complex.sqrt(-1) // i
```