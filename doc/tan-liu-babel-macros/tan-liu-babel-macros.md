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
> Take our []`@@` syntax, for example](/doc/tan-liu-article.md), if it works for a normal function declaration, it's expected to work for anonymous functions, arrow functions, class methods. Have you thought about how it would work with generator functions and async functions? If a curried function returns another function, does that make the returned function curried as well?

This is the whole point of language design. Wonderfully summarized.

## The case of facebookincubator/idx

[facebookincubator/idx][] is a  library that preceded [optional chaining](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining). 

It provided `idx`, which is a utility function for traversing properties on objects and arrays,
where intermediate properties may be null or undefined.
A difference between `idx` and optional chaining is what happens when
an intermediate property is `null` or `undefined`. With `idx`, the `null` or `undefined`
value is returned, whereas optional chaining would resolve to `undefined`.

> Well, if you look at the [facebookincubator/idx][] library, it uses a Babel plugin to search through require or imports of `idx` and replaces all its usages, for example when you write:

[facebookincubator/idx]: https://github.com/facebookincubator/idx
