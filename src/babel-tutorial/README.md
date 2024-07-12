# Babel Tutorial

This tutorial shows how to use Babel to transpile JSX code for a simple web application 
using only Babel and how to debug the resulting app using the generated source maps and 
Google Chrome.

* [Introduction](https://inspirnathan.com/posts/12-babel-tutorial-part-1)
* [React and JSX](https://inspirnathan.com/posts/13-babel-tutorial-part-2)
* [Source Maps](https://inspirnathan.com/posts/14-babel-tutorial-part-3)
<!--
* [Transpiling Code for Older Browsers](https://inspirnathan.com/posts/17-babel-tutorial-part-4)
* [Quick Command To Discover Used Ports](https://inspirnathan.com/posts/15-quick-command-to-discover-used-ports)
* [How To Setup VirtualBox For Internet Explorer](https://inspirnathan.com/posts/16-how-to-setup-virtualbox-for-internet-explorer)
* [Babel Tutorial Part 4 - Compatibility With Older Browsers](https://inspirnathan.com/posts/17-babel-tutorial-part-4)
* [Npm Tips And Tricks](https://inspirnathan.com/posts/18-npm-tips-and-tricks)
-->


## Compiling with source maps

```sh
➜  babel-tutorial git:(main) ✗ npm run build:external

> babel-tutorial@1.0.0 build:external
> babel src -d lib --source-maps

Successfully compiled 1 file with Babel (251ms).
```

That will generate a `lib` directory with the compiled code and a source map file:

```sh
➜  babel-tutorial git:(main) ✗ tree lib 
lib
├── index.js
└── index.js.map

0 directories, 2 files
```

Your `lib/index.js` file will now point to an external source map instead of using a data URL:

```js
➜  babel-tutorial git:(main) ✗ cat lib/index.js
function Celebrate() {
  return /*#__PURE__*/React.createElement("p", null, "It's working! \uD83C\uDF89\uD83C\uDF89\uD83C\uDF89");
}
ReactDOM.render( /*#__PURE__*/React.createElement(Celebrate, null), document.getElementById('root'));
//# sourceMappingURL=index.js.map
```

The `index.js.map` source map is equivalent to the base 64 decoded version of the data URL.

If we use Google Chrome, you can easily see the available source maps by clicking on the "`Sources`" tab in the Chrome dev tools and set breakpoints. 


