//const chalk = require('chalk');
import chalk from 'chalk';

//console.log(chalk);
let args = [ 'server.js', '--verbose', '--watch' ];
let envars = {
  NODE_ENV: 'production',
  PORT: '3000',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'user',
};

// Status quo
console.log(
  chalk.blue(
    `$ ${
      Object.keys(envars)
      .map(envar => `${envar}=${envars[envar]}`)
      .join(' ') // 'NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user'
    }`,
    'node',
    args.join(' ') // 'server.js --verbose --watch'
  )
); // Outputs: $ NODE_ENV=production PORT=3000 DB_HOST=localhost DB_PORT=5432 DB_USER=user node server.js --verbose --watch

// With pipes
Object.keys(envars)
  .map(envar => `${envar}=${envars[envar]}`)
  .join(' ')
  |> `$ ${^^}`
  |> chalk.red(^^, 'node', args.join(' '))
  |> console.log(^^);