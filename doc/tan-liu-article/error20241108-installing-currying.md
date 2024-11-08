# Error installing currying

```
➜  tan-liu-article git:(main) date
viernes,  8 de noviembre de 2024, 12:18:29 WET
```

```sh
➜  tan-liu-article git:(main) nvm use v20
Now using node v20.5.0 (npm v9.8.0)
```

Gives an error `EBADENGINE` by `@eslint/config-array` with several versions of node (v20.5.0). The only one that worked was `v23.0.0`

```sh
➜  tan-liu-article git:(main) npm install currying
npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: @eslint/config-array@0.15.1
npm ERR! notsup Not compatible with your version of node/npm: @eslint/config-array@0.15.1
npm ERR! notsup Required: {"node":"^18.18.0 || ^20.9.0 || >=21.1.0"}
npm ERR! notsup Actual:   {"npm":"9.8.0","node":"v20.5.0"}

npm ERR! A complete log of this run can be found in: /Users/casianorodriguezleon/.npm/_logs/2024-11-08T12_16_00_617Z-debug-0.log
```


- [Back to Plugin Second Approach: using the Babel Helpers](plugin-second-approach.md)
- [Back to the article](/doc/tan-liu-article.md#testing-the-plugin-second-approach)
- [Back to the Plugin First Approach](plugin-first-approach.md)