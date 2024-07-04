import { Tuple as _Tuple } from "@bloomberg/record-tuple-polyfill";
let a = _Tuple(1, 2, 3);
let b = _Tuple(1, 2, 3);
console.log(a == b);
