## Proposal JavaScript Records & Tuples Proposal

See https://github.com/tc39/proposal-record-tuple

A record is analogous to an Object in JavaScript with the exception that the Record is not an Object but a deeply immutable primitive value. 
Likewise, a Tuple is like an Array but is a deeply immutable primitive value.


## node version

Does not work wit node v20.0.0.

```
➜  record-and-tuple git:(main) ✗ npm install --save-dev @babel/plugin-proposal-record-and-tuple
npm ERR! code EBADENGINE
```

## babel.config.json

`➜  record-and-tuple git:(main) ✗ cat babel.config.json`
```json 
{
    "plugins": [
        [ "@babel/plugin-proposal-record-and-tuple", { "importPolyfill": true} ]
    ]
}
```

## Install dependencies:

```
✗ npm install --save-dev @babel/plugin-proposal-record-and-tuple
✗ npm i "@bloomberg/record-tuple-polyfill"
```

## Run babel

```js
➜  record-and-tuple git:(main) ✗ npx babel hello.js       
import { Tuple as _Tuple } from "@bloomberg/record-tuple-polyfill";
let a = _Tuple(1, 2, 3);
let b = _Tuple(1, 2, 3);
console.log(a == b)
```

The execution of the above code will print `true` to the console while the equivalent arrays code will print `false`, since the 
`==` operator compares the references of the objects and not the values.

```
record-and-tuple git:(main) ✗ npx babel hello.js -o hello.mjs
➜  record-and-tuple git:(main) ✗ node hello.mjs 
true
```

## References

1. https://babeljs.io/docs/babel-plugin-proposal-record-and-tuple
2. [Records & Tuples are coming: the next exciting JavaScript feature](https://youtu.be/eTFMhwrbxD0?si=TLEMFDdYfVJ8h7Ej) by  Nicolò Ribaudo at jsday 2022