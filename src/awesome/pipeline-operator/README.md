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