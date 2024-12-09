# Building and publishing 

In this document we will cover the following topics:

- Babel's Makefile
- Lerna
- Gulp and Rollup
- How to publish from a fork of Babel?

The document summarizes Pablo Santana's ([@PSantanaGlez13](https://github.com/PSantanaGlez13)) first attempts to understand Babel's building and publishing.


## Makefile

Babel's Makefile contains many actions. We will mainly cover three of them (although these actions call other actions, we will describe their overall behavior).
1. `make bootstrap`: Installs all dependencies for all packages using `lerna bootstrap` (more on Lerna later). After installing dependencies, `make build` is run.
2. `make build`: Babel uses Flow, so the project needs to be compiled into plain JavaScript. Two packages are used for this: `gulp` and `rollup` (more on them later).
3. `make publish`: Babel's packages are published with Lerna. Some tests are run to ensure that the uploaded code complies with Babel's linting rules.

## Lerna

Babel is a monorepo, so all packages are in the same repository. A few issues arise from this:

- Installing dependencies for each of these packages can be a hard task. Specially with how many packages Babel has, there is a need of automating the installation of dependencies of each package, since just using `npm install` won't cut it.
- The internal dependencies between packages within the same repo also need to be resolved. Let us say that we want to install `@babel/parser` from `@babel/babel-core`. If we installed the dependency from a registry like npm, the version of the parser could not reflect the current state of the package if it has not been published. Also there is no need to install a package that we already have in our repository. Using relative paths from one package to another would not work neither.
- If you change various packages, you may want a way to publish them all at the same time instead of one by one.

To resolve this issues, Babel uses Lerna, a monorepo management tool. Before we continue, take into consideration the next two things:
- Packages are registered in Lerna's configuration file `lerna.json`. Babel has registered the directory `packages`, so all subdirectories are considered packages.
- We consider that a package is an internal dependency if it is registered in the configuration file.

Another important thing of `lerna.json` is that it let us prepare some flags for Lerna's commands. For example, maybe we want to use `--ignore-changes` with `lerna publish` to ignore the changes of some files to not publish them. In this case, we can add the following to the configuration file:

```json
"command": {
    "publish": {
      "ignoreChanges": [
        "*.md",
        "*.txt",
        "test/**",
        "**/test/**",
        "codemods/**",
        "# We ignore every JSON file, except for native-modules, built-ins and plugins defined in babel-preset-env/data.",
        "@(!(native-modules|built-ins|plugins|package)).json",
        "# Until the ESLint packages version are aligned with Babel's, we ignore them",
        "eslint/**",
        "# Making sure we only upload the function assignment (left side) packages",
        "packages/@(!(babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser))/**"
      ]
    }
  },
```

It should also be noted that Babel [does not use Lerna anymore](https://github.com/babel/babel/discussions/12622).

The problems that Babel solves with lerna [can be solved with workspaces](https://lerna.js.org/docs/legacy-package-management).

### lerna bootstrap

Installs the dependencies of every package.

Internal dependencies are symlinked if needed. For external dependencies, `npm install` is used.

[Reference.](https://github.com/lerna/lerna/tree/main/libs/commands/bootstrap)

### lerna publish

Publishes every registered package (as long as it is public).

There is a few alternatives when publishing.

- `lerna publish`. Publishes packages that have changed since the last release.
- Babel's way: `lerna publish from-git`. The packages that have been tagged in the current commit are published. Packages are tagged by running `lerna version`. In Babel's makefile there is a `make new-version` action. [`lerna version`](https://github.com/lerna/lerna/tree/main/libs/commands/version) changes the version of the packages if they have been modified and then they are pushed to the remote repository.
- `lerna publish from-package`. The `package.json` version of each package is checked. If it is not published in the registry, the version is published.

[Reference.](https://github.com/lerna/lerna/tree/main/libs/commands/publish)

## Gulp and Rollup

Gulp is similar to Make: both are used to automate tasks. The major diference is that Gulp is written in JavaScript. In the case of Babel, it is used to build the project, since Babel is written in Flow. The Gulpfile.js of the project (the "makefile" of Gulp), has some tasks registered:

```js
// Different options to compile Babel using a bundler
gulp.task("build-rollup", () => buildRollup(libBundles));
gulp.task("build-babel-standalone", () => buildRollup(standaloneBundle));
gulp.task("build-babel", () => buildBabel(/* exclude */ libBundles));
gulp.task("build", gulp.parallel("build-rollup", "build-babel"));
gulp.task("default", gulp.series("build"));
gulp.task("build-no-bundle", () => buildBabel());
gulp.task(
  "watch",
  gulp.series("build-no-bundle", function watch() {
    gulp.watch(defaultSourcesGlob, gulp.task("build-no-bundle"));
  })
);
```

Rollup is a bundler: it takes a project and writes it in one single JS file, with the option to choose the output. At first I thought it was involved in compiling Flow into plain JS, but if we take a look at the previous tasks there is an option to `build-no-bundle` which does not use Rollup. It uses `babel()` which is a tool, called `gulp-babel`, created [to integrate Babel and Gulp](https://github.com/babel/gulp-babel). `gulp-babel` uses `@babel/core` to transform the given code. [So Babel compiles itself](https://en.wikipedia.org/wiki/Bootstrapping_(compilers))? If we check Babel's configuration file (`babel.config.js`) we can see the following:

```js
    // More configuration
    plugins: [
      // TODO: Use @babel/preset-flow when
      // https://github.com/babel/babel/issues/7233 is fixed
      "@babel/plugin-transform-flow-strip-types",
    ]
    // More configuration
```

The `"@babel/plugin-transform-flow-strip-types"` is (as the name implies) the plugin used to strip Flow type annotations from the code. The thing is that I found out that this plugin also uses a Flow type annotation and is transformed into JavaScript.

There ares two alternatives that could be happening, at least that I ([@PSantanaGlez13](https://github.com/PSantanaGlez13)) came up with:

1. The plugin and Flow parser (which, by the way, is also written in Flow) were compiled by a different tool in a previous version to JavaScript. This is known as [bootstrapping](https://en.wikipedia.org/wiki/Bootstrapping_(compilers)).
2. There is another way the Flow annotations are being dealt with.

I concluded that the first choice is the answer. The reasoning is that the root directory of Babel is not considered a package and therefore the plugin to strip the types is being installed from the registry, so it has been compiled previously.

## How to publish from a fork of Babel?

Let's say we want to modify and/or create packages in the Babel repository and then publish them. In my case ([@PSantanaGlez13](https://github.com/PSantanaGlez13)), I changed the `babel-parser` and created two additional packages with a plugin and support for that plugin. When trying to publish, I modified the `lerna.json` to ignore packages that are not mine (another option could be to set all the other packages to private so Lerna won't publish them unless you force it to). However, publishing from the Makefile as it is runs linting tests, and because I changed the parser, my tests were considered errors and would not allow my packages to be published.

Even after removing the tests, my packages still would not publish. The reason for this is that we need to run `make new-version` first. This will run `lerna version` which will bump the version of the packages one version up and then tag them so `lerna publish from-git` (called by `make publish`) will publish them. The issue with this is that all packages are being considered changed, so they will all be tagged and then, when publishing, they will appear as new packages.

The solution to this issue is to use `make bootstrap; npx lerna publish from-package`. The first part is needed to build the project itself before publishing (remember that `make bootstrap` runs `make build`) and the second part publishes the packages that are not found in the publishing registry. This means that, since Babel's packages are already published, we can publish only the packages we want. On the other hand, because `lerna version` will try to update all the packages' version we may prefer to use other ways to change the version of our packages (perhaps `npm version` or, if they are few, we can handle them individually). 

Remember to configurate your `package.json` for each and every package you want to publish. This would be an example file:
```json
{
  "name": "@ull-esit-pl/babel-plugin-left-side-plugin",
  "version": "1.0.1",
  "description": "Support plugin for the assignable functions",
  "main": "lib/plugin.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@ull-esit-pl/parser-left-side": "^1.0.0",
    "@ull-esit-pl/babel-plugin-left-side-support": "^1.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg",
    "directory": "packages/babel-plugin-left-side-plugin"    
  },
  "publishConfig": {
    "access": "public",
  },
  "author": "Pablo Santana Gonzalez <alu0101480541@ull.edu.es>",
  "license": "ISC",
}
```
The key `publishConfig.access: public` is specially important, since scoped packages are private by default (if you are using a scope). 

So far, this would be the result of trying to publish my own packages:
```sh
sombra@P:~/projects/left-side-JS/babel-tanhauhau$ yarn lerna publish from-package
yarn run v1.22.22
$ /home/sombra/projects/left-side-JS/babel-tanhauhau/node_modules/.bin/lerna publish from-package
lerna notice cli v3.19.0
lerna WARN Yarn's registry proxy is broken, replacing with public npm registry
lerna WARN If you don't have an npm token, you should exit and run `npm login`
lerna WARN Unable to determine published version, assuming "@ull-esit-pl/parser-left-side" unpublished.
lerna WARN Unable to determine published version, assuming "@ull-esit-pl/babel-plugin-left-side-plugin" unpublished.
lerna WARN Unable to determine published version, assuming "@ull-esit-pl/babel-plugin-left-side-support" unpublished.

Found 3 packages to publish:
 - @ull-esit-pl/parser-left-side => 1.0.0
 - @ull-esit-pl/babel-plugin-left-side-plugin => 1.0.0
 - @ull-esit-pl/babel-plugin-left-side-support => 1.0.0

? Are you sure you want to publish these packages? Yes
lerna info publish Publishing packages to npm...
lerna info Verifying npm credentials
lerna http fetch GET 200 https://registry.npmjs.org/-/npm/v1/user 629ms
lerna http fetch GET 200 https://registry.npmjs.org/-/org/psantanaglez13/package?format=cli 263ms
lerna WARN The logged-in user does not have any previously-published packages, skipping permission checks...
lerna info Checking two-factor auth mode
lerna http fetch GET 200 https://registry.npmjs.org/-/npm/v1/user 621ms
lerna http fetch PUT 404 https://registry.npmjs.org/@ull-esit-pl%2fbabel-plugin-left-side-support 316ms
lerna ERR! E404 Not found
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```
Notice that you have to run `npm login` to get a token and be able to publish packages. But it still fails. The reason I think this fails is because I do not have permissions in the npmjs organization I am trying to publish in and [to publish in a scope you need to be part of the organization](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) (atleast for npmjs).

As an alternative, you can publish from the npm's GitHub registry.
To publish or install from the GitHub registry follow [these instructions](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
I ended up publishing from GitHub registry and it worked perfectly.

Now you should be able to install your package from any project. Keep in mind that if you are using the Github registry you will need to configure a `.npmrc` file and get a GitHub personal access token (check the previous link).

### In summary:

1. Configurate all the `package.json` files. Remember the scoped name if you want to use a scope (`publishConfig.access: "public"` for this case).
2. Run `make bootstrap` to install all dependencies, both external and internal. I suggest you try everything is working before the next step by trying your packages.
3. Run `npx lerna publish from-package`. Check that the packages that are shown are the correct ones. If publishing fails, check the org and registry you are trying to publish on.

If you are using the GitHub registry, check [Github's tutorial](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). Specially the part about publishing multiple packages on the same repository.

### Note about using the packages.

Watch out when installing `babel-cli` to run `npx babel`. In npmjs there are two versions: the old one, which is [babel-cli](https://www.npmjs.com/package/babel-cli), and [@babel/babel-cli](https://www.npmjs.com/package/@babel/cli). The first one is Babel 6 and does not allow for some features you may have used (for example, `parserOverride` for your plugin) and the second one is Babel 7.

## Installing the module 

See the instructions at repo [ULL-ESIT-PL/babel-left-side-npm-test](https://github.com/ULL-ESIT-PL/babel-left-side-npm-test/tree/main) to know how to install Pablo's @ull-esit-pl/parser-left-side set of packages [published in the GitHub registry](https://github.com/orgs/ULL-ESIT-PL/packages) inside the ull-esit-pl organization.

### References

- https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg
- https://github.com/ULL-ESIT-PL/babel-learning/tree/main
