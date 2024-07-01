// Example Accessing deeply nested properties 
// https://babeljs.io/docs/babel-plugin-transform-optional-chaining#accessing-deeply-nested-properties
// Run it with: npx babel --plugins @babel/plugin-transform-optional-chaining script.js
const obj = {
  foo: {
    bar: {
      baz: 42,
    },
  },
};

const baz = obj?.foo?.bar?.baz; // 42

const safe = obj?.qux?.baz; // undefined

// Optional chaining and normal chaining can be intermixed
obj?.foo.bar?.baz; // Only access `foo` if `obj` exists, and `baz` if
// `bar` exists

// Example usage with bracket notation:
obj?.["foo"]?.bar?.baz; // 42