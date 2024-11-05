# Configuring Visual Studio Code (VS Code) to Support Flow Syntax in JavaScript Files

Babel.js is written in Flow, a static type checker for JavaScript. It is not written in TypeScript. 

When you're writing JavaScript files but want to use Flow features like type checking, you need to istall 
the [Flow Language Support Extension](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode). 


## Initial problems

When editing the Babel project files, I've got several warnings in VSCode stating that 

["type annotations can only be used in typescript"](https://stackoverflow.com/questions/48859169/error-types-can-only-be-used-in-a-ts-file-visual-studio-code-using-ts-che)

The solution of  disabling the configuration variable `"javascript.validate.enable"` in the settings is not recommended.

## Flow for Visual Studio Code

Follow the instructions at https://github.com/flow/flow-for-vscode#setup

### Setup

* Make sure you have a `.flowconfig` file somewhere in your project.
* Make sure you are able to run the `flow` command from the command line (or see [Configuration](#configuration) to customize the command or use NPM packaged flow).
* Set `javascript.validate.enable` option to `false` **or** completely disable the built-in TypeScript extension for your project (see gif below):

<p align="center">
  <img src="https://github.com/flowtype/flow-for-vscode/raw/main/readme/flow-disable-tsc.gif"/>
</p>

* If you install Flow via `flow-bin` (recommended), then we will by default try to use this installation of flow by looking for it in `node_modules`. This behavior can be disabled by setting the `flow.useNPMPackagedFlow` setting to `false`.
* If you install Flow globally (for example, `npm install -g flow-bin`), make sure `flow` is available on your `PATH`. If neither are true, then a version bundled with this extension will be used, but this is discouraged as it may change over time.

### Configuration

You can specify a configuration by amending the VS Code `settings.json` file. Access this through Preferences → Settings. You must reload VS Code after installing this extension for these settings to take affect.

* `flow.useNPMPackagedFlow` (default: true) allows using flow from your node_modules for VSCode. 
  > **Note:** Plugin will look for node_modules in `flowconfigDir` and root of `workspaceFolder`

* `flow.pathToFlow` (default: 'flow') Absolute path to flow binary.
  ```javascript
    {
      // You can use ${workspaceFolder} it will be replaced by workspaceFolder path
      "flow.pathToFlow": "${workspaceFolder}/node_modules/.bin/flow"

      // You can also use var ${flowconfigDir} it will be replaced by flowconfigDir path
      "flow.pathToFlow": "${flowconfigDir}/node_modules/.bin/flow"

      // or use some absolute path
      "flow.pathToFlow": "/home/test/some_path/flow"
    }
  ````
  > **Note:** Path is normalized and ".cmd" is added if needed.

* `flow.useBundledFlow` (default: true) fallback to flow bundled with this plugin if nothing else works.

* `flow.showUncovered` (default: false) If `true` will show uncovered code by default. You can also toggle it later by using command or clicking on status bar widget.

* `flow.coverageSeverity` (default: 'info'): Type coverage diagnostic severity.

* `flow.lazyMode` (default: null): to override the [lazy mode](https://flow.org/en/docs/lang/lazy-modes/). Prefer to set this in `.flowconfig` instead.

* `flow.stopFlowOnExit` (default: true) stop flow server on exit from Project.

* `flow.useCodeSnippetOnFunctionSuggest` (default: true) Complete functions with their parameter signature.

* `flow.enabled` (default: true) you can disable flow for some Project for example.


