# Reading "Babel Macros" by Tan Liu

The article can be found at https://lihautan.com/babel-macros.

## Disadvantages of creating a syntax extension

It is quite accurate the list of observations on the disadvantages of crating custom syntax.

- Documentation and community support
- Tooling: Linting, Editor syntax higlighting, etc.
- Maintainability: It is impossible to keep the pace and at surely the future of any extension depends on the acceptance of the community.

### Consistency of syntax

>  This is the hardest part of creating a new syntax. An added syntax is an added mental concept for the language users, so the new mental model should be transferable to every scenario of the language.
>
> Take our [`@@` syntax, for example](/doc/tan-liu-article.md), if it works for a normal function declaration, it's expected to work for anonymous functions, arrow functions, class methods. Have you thought about how it would work with generator functions and async functions? If a curried function returns another function, does that make the returned function curried as well?

This is the whole point of language design. Wonderfully summarized.

## The case of facebook/idx

[facebook/idx][] is a  library that preceded JS [optional chaining](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining). 
It provides a function `idx`, which is a utility function for traversing properties on objects and arrays,
where intermediate properties may be null or undefined.
A difference between `idx` and optional chaining is what happens when
an intermediate property is `null` or `undefined`. With `idx`, the `null` or `undefined`
value is returned, whereas optional chaining would resolve to `undefined`.

> Well, if you look at the [facebook/idx][] library, it uses a Babel plugin to search through require or imports of `idx` and replaces all its usages, for example when you write:

> ```js
> import idx from 'idx';
> 
> function getFriends() {
>   return idx(props, _ => _.user.friends[0].friends);
> }
> ```
> it gets transformed into:
> 
> ```js
> function getFriends() {
>   return props.user == null // Notice that  undefined == null is true in JS
>     ? props.user
>     : props.user.friends == null
>     ? props.user.friends
>     : props.user.friends[0] == null
>     ? props.user.friends[0]
>     : props.user.friends[0].friends;
> }
> ```

> While maintaining a good developer experience (DX), we've shifted the runtime overhead to compile time.

### Running babel with idx

To see it working, install `idx` and `babel-plugin-idx`:

```
➜  babel-learning git:(main) ✗ npm install idx babel-plugin-idx
```
There is an example you can use as input at [src/tan-liu-babel-macros/getfrieds.js](src/tan-liu-babel-macros/getfrieds.js):
`➜  babel-learning git:(main) ✗ cat src/tan-liu-babel-macros/getfrieds.js`
```js
import idx from 'idx';

let props = { user: { friends: [{ friends: [] } ] }}

function getFriends() {
  return idx(props, _ => _.user.friends[0].friends);
}

console.log(getFriends())
```

To transform the `src/tan-liu-babel-macros/getfrieds.js` example:

`➜  babel-learning git:(main) ✗ npx babel src/tan-liu-babel-macros/getfrieds.js --plugins=idx`
```js
"use strict";

let props = {
  user: {
    friends: [{
      friends: []
    }]
  }
};
function getFriends() {
  var _ref;
  return (_ref = props) != null ? (_ref = _ref.user) != null ? (_ref = _ref.friends) != null ? (_ref = _ref[0]) != null ? _ref.friends : _ref : _ref : _ref : _ref;
}
console.log(getFriends());
```

### Running flow with idx

See the file [src/tan-liu-babel-macros/getfriends-flow.flow](src/tan-liu-babel-macros/getfriends-flow.flow):

`➜  tan-liu-babel-macros git:(main) ✗ cat getfriends-flow.flow`
```js
import idx from 'idx';

let props = { user: { friends: [{ friends: [] } ] }}

function getFriends() {
  return idx(props, _ => _.user.friends[0].friends);
}

console.log(getFriends())
```
Then we can run flow with the following command:

`➜  tan-liu-babel-macros git:(main) ✗ npx babel --presets @babel/preset-flow  --plugins=idx  getfriends-flow.flow`
```js
"use strict";

let props = {
  user: {
    friends: [{
      friends: []
    }]
  }
};
function getFriends() {
  var _ref;
  return (_ref = props) != null ? (_ref = _ref.user) != null ? (_ref = _ref.friends) != null ? (_ref = _ref[0]) != null ? _ref.friends : _ref : _ref : _ref : _ref;
}
console.log(getFriends());
```

Notice how the flow type annotations are removed.





[facebook/idx]: https://github.com/facebook/idx
