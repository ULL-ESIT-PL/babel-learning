/* From https://babeljs.io/docs/config-files:
We recommend using json format type wherever possible: 
JS config files are handy if you have complex configuration 
that is conditional or otherwise computed at build time. 
However, the downside is that JS configs are less statically analyzable, 
and therefore have negative effects on cacheability, 
linting, IDE autocomplete, etc. 
Since babel.config.json and .babelrc.json are static JSON files, 
it allows other tools that use Babel such as bundlers to cache the results of Babel safely, 
which can be a huge build performance win.

The extension can also be .babelrc.js, .babelrc.cjs, or .babelrc.mjs.
*/
module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env",
    /* .targets is not allowed in preset options
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
      */
   ];
  const plugins = [ ];

  /*
  if (process.env["ENV"] === "prod") {
    plugins.push(...);
  }
  */

  return {
    presets,
    plugins
  };
}