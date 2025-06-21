In the Hack language’s pipe syntax, the **righthand** side of the pipe 
is an expression containing a s**pecial placeholder**, 
which is evaluated with the placeholder *bound to the result of evaluating the lefthand side's expression*. 
That is, we write 

```js
➜  pipeline-operator git:(main) ✗ cat example.mjs 
let value = 1;

function one(x) {
    return x + 1;
}
function two(x) {
    return x * 2;
}
function three(x) {
    return x ** 2;
}
// Status quo
console.log(
    value |> one(^^) |> two(^^) |> three(^^) // 16 == ((1 + 1) * 2) ** 2
); 
```

to pipe `value` through the three functions. See [example.js](example.js). 

```  
➜  pipeline-operator git:(main) ✗ npx babel example.mjs | node
16
```

- https://babeljs.io/docs/babel-plugin-proposal-pipeline-operator
- [index.mjs](index.mjs)

```js 
➜  pipeline-operator git:(main) npx babel index.mjs       
var _ref, _ref2;
//const chalk = require('chalk');
import chalk from 'chalk';

//console.log(chalk);
let args = ['server.js', '--verbose', '--watch'];
let envars = {
  NODE_ENV: 'production',
  PORT: '3000',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'user'
};

// Status quo
console.log(chalk.blue(`$ ${Object.keys(envars).map(envar => `${envar}=${envars[envar]}`).join(' ') // 'NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user'
}`, 'node', args.join(' ') // 'server.js --verbose --watch'
)); // Outputs: $ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user node server.js --verbose --watch

// With pipes
_ref2 = Object.keys(envars).map(envar => `${envar}=${envars[envar]}`).join(' '), _ref = chalk.red(`$ ${_ref2}` // '$ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user'
, 'node', args.join(' ')) // '$ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user node server.js --verbose --watch'
, console.log(_ref); // Outputs the same as above
```

```
➜  pipeline-operator git:(main) npx babel index.mjs | node
$ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user node server.js --verbose --watch
$ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user node server.js --verbose --watch
```