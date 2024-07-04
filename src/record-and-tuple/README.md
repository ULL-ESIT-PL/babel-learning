## node version

Does not work wit node v20.0.0.

```
➜  record-and-tuple git:(main) ✗ npm install --save-dev @babel/plugin-proposal-record-and-tuple
npm ERR! code EBADENGINE
```

## babel.config.json


```json 
➜  record-and-tuple git:(main) ✗ cat babel.config.json 
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

```
record-and-tuple git:(main) ✗ npx babel hello.js -o hello.mjs
```

```
➜  record-and-tuple git:(main) ✗ node hello.mjs 
true
```

## References

1. https://babeljs.io/docs/babel-plugin-proposal-record-and-tuple
2. [Records & Tuples are coming: the next exciting JavaScript feature](https://youtu.be/eTFMhwrbxD0?si=TLEMFDdYfVJ8h7Ej) by  Nicolò Ribaudo at jsday 2022