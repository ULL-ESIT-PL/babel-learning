## What's your use case?

There are two main options:

- babel.config.json
- .babelrc. The extension can also be `.babelrc.js`, `.babelrc.cjs`, or `.babelrc.mjs`.

## babel.config.json

Example: 

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
}
```

In this example:

`@babel/preset-env` is used to apply a collection of plugins for modern JavaScript syntax.
Additional plugins (`@babel/plugin-transform-runtime` and` @babel/plugin-proposal-class-properties`) are added to handle specific transformations not covered by the preset.

## Presets and Plugins

Presets are collections of plugins bundled together. They are essentially a way to simplify configuration by **grouping together a set of plugins that target a specific environment or set of features**. Presets allow you to apply multiple plugins with a single configuration entry. 
If you need to transform specific parts of your code and have very precise requirements, you might choose to specify individual plugins.

## JSON vs. JS formats

The Babel people recommend using the json file type versus the JS type: 
- JS config files are handy if you have complex configuration that is conditional or otherwise computed at build time. However, 
- The downside is that JS configs are less statically analyzable, and therefore have negative effects on cacheability, linting, IDE autocomplete, etc. 
- Since `babel.config.json` and `.babelrc.json` are static JSON files, it allows other tools that use Babel such as bundlers to cache the results of Babel safely, which can be a huge build performance win.

The list of options is here: https://babeljs.io/docs/option

### plugin entry

The entry `plugin` is an array of plugins to activate when processing this file. 

Babel's configuration merging is relatively straightforward:

- options will overwrite existing options when they are present.
- For `plugins` and `presets`, they are replaced based on the identity of the plugin/preset object/function itself combined with the name of the entry.


### preset entry

The `preset`entry is an array of presets to activate when processing. 

Note: The format of presets is identical to plugins, except for the fact that name normalization expects "preset-" instead of "plugin-", and presets cannot be instances of Plugin.

## Working with Monorepos

Monorepo-structured repositories usually contain many packages.
With [monorepo setups](https://babeljs.io/docs/config-files#monorepos), the core thing to understand is that Babel treats your working directory as its logical "root", which causes problems if you want to run Babel tools within a specific sub-package without having Babel apply to the repo as a whole.

## JS Config Files

JS config files may export a function that will be passed config function API. See https://babeljs.io/docs/config-files#config-function-api:

```js
module.exports = function(api) {
  return {};
};
```

## References

The documentation: https://babeljs.io/docs/config-files

