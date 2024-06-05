# Configuring Visual Studio Code (VS Code) to Support TypeScript Syntax in JavaScript Files

I've got several warnings in VSCode stating that 

["type annotations can only be used in typescript"](https://stackoverflow.com/questions/48859169/error-types-can-only-be-used-in-a-ts-file-visual-studio-code-using-ts-che)

The solution of  disabling the configuration variable `"javascript.validate.enable"` in the settings is not recommended.

To configure Visual Studio Code (VS Code) to support TypeScript syntax in files with a `.js` extension, you need to set up a few configurations. This is useful when you're writing JavaScript files but want to use TypeScript features like type checking and IntelliSense.

Here's how you can achieve this:


1. **Enable JavaScript Type Checking**:
   Create or update your `tsconfig.json` file to enable type checking for JavaScript files. You can do this by including the `allowJs` and `checkJs` options in your configuration.

   File `.vscode/settings.json`
   ```js
   {
     "compilerOptions": {
       "allowJs": true,
       "checkJs": true,
       "noEmit": true,
       "target": "es6", // Adjust to your target JavaScript version
       "module": "commonjs", // Adjust to your module system
       "baseUrl": "./",
       "paths": {
         // Configure paths if needed
       },
       "lib": ["es6", "dom"], // Adjust to your environment
       "jsx": "react" // If you are using JSX
     },
     "include": [
       "./src/**/*" // Adjust to your project structure
     ],
     "exclude": [
       "node_modules"
     ]
   }
   ```

2. **Configure VS Code Settings**:
   Adjust your VS Code settings to recognize TypeScript syntax in `.js` files. Open your VS Code settings (`.vscode/settings.json` in your project or through the settings UI) and add the following:

   ```json
    ➜  babel-tanhauhau git:(master) ✗ cat .vscode/settings.json 
    {
      "javascript.validate.enable": false, // Disable built-in validation
      "typescript.validate.enable": true, // Enable TypeScript validation
      "files.associations": {
        "*.js": "typescript" // Associate .js files with TypeScript
      }
    }
   ```

### Example Directory Structure

Your project directory might look something like this:

```
my-project/
├── node_modules/
├── src/
│   ├── index.js
│   └── otherFile.js
├── .vscode/
│   └── settings.json
├── tsconfig.json
├── package.json
└── package-lock.json
```

