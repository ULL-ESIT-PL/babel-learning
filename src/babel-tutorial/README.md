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

Run the HTTP server:

```sh
➜  babel-tutorial git:(44m.50s) ✗ npm start

> babel-tutorial@1.0.0 start
> serve
``` 

The option `-s, --source-maps [true|false|inline|both]` generates source maps for the compiled code.

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

The `index.js.map` source map is equivalent to the base 64 decoded version of the data URL:

`➜  babel-learning git:(main) cat src/babel-tutorial/lib/index.js.map | jq .`
```js
{
  "version": 3, # Declares which version of the source map spec is being used,
  "file": "index.js", # input source file that was used to generate the output.
  "names": [   # A list of identifiers used in the source code which were changed in or removed from the output.
    "Celebrate",
    "hi",
    "v",
    "console",
    "log",
    "React",
    "createElement",
    "ReactDOM",
    "render",
    "document",
    "getElementById"
  ],
  "sources": [  A list of input source files that were used to generate the output
    "../src/index.js"
  ],
  # This optional field can include the original source content for each file in
  # the "sources" property. This option should only be omitted if the tool using
  # the source map can retrieve the sources via url or from the filesystem.
  "sourcesContent": [
    "function Celebrate({  hi }) {\n  let v = hi;\n  console.log(v);\n  return <p>{v} 🎉🎉🎉</p>\n}\n\nReactDOM.render(\n  <Celebrate hi=\"Hello Babel!\" />,\n  document.getElementById('root'),\n)\n"
  ],
  # These comma and semi-colon separated values are base64-encoded VLQ
  # values that point from every position in the output back to positions in the input sources.
  "mappings": "AAAA,SAASA,SAASA,CAAC;EAAGC;AAAG,CAAC,EAAE;EAC1B,IAAIC,CAAC,GAAGD,EAAE;EACVE,OAAO,CAACC,GAAG,CAACF,CAAC,CAAC;EACd,oBAAOG,KAAA,CAAAC,aAAA,YAAIJ,CAAC,EAAC,uCAAU,CAAC;AAC1B;AAEAK,QAAQ,CAACC,MAAM,eACbH,KAAA,CAAAC,aAAA,CAACN,SAAS;EAACC,EAAE,EAAC;AAAc,CAAE,CAAC,EAC/BQ,QAAQ,CAACC,cAAc,CAAC,MAAM,CAChC,CAAC",
  "ignoreList": []
}
```

Visit the served page with Google Chrome. 

You can easily see the available source maps by clicking on the "`Sources`" tab in the Chrome dev tools and set breakpoints. 

![/images/source-map-debugging.png](/images/source-map-debugging.png)
