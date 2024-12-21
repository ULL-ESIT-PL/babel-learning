# How to publish from a fork of Babel 7.10? Building and publishing 

In this document we will cover the following topics:

- Babel 7.10's Makefile
- Lerna
- Gulp and Rollup
- How to publish from a fork of Babel 7.10?

The document summarizes Pablo Santana's ([@PSantanaGlez13](https://github.com/PSantanaGlez13)) first attempts to understand Babel's building and publishing.


## Makefile

[Babel 7.10's Makefile](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/Makefile#L222) contains many actions. We will mainly cover three of them (although these actions call other actions, we will describe their overall behavior).
1. `make bootstrap`: Installs all dependencies for all packages using `lerna bootstrap` (more on Lerna later). After installing dependencies, `make build` is run.
2. `make build`: Babel 7.10 uses [Flow](https://flow.org/), so the project needs to be compiled into plain JavaScript. Two packages that help in the tasks are `gulp` and `rollup`.
3. `make publish`: Babel 7.10's packages are published with Lerna. Tests are run to ensure that the uploaded code complies with Babel's linting rules.

## Lerna

Babel is a monorepo, so all packages are in the same repository. A few issues arise from this:

- Installing dependencies for each of these packages can be a hard task. Specially due to the large number of packages Babel has, there is a need of automating the installation of dependencies of each package.
- The internal dependencies between packages within the same repo also need to be resolved. Let us say that we want to install `@babel/parser` from `@babel/babel-core`. If we installed the dependency from a registry like npm, the version of the parser could not reflect the current state of the package if it has not been published. Also there is no need to install a package that we already have in our repository. Using relative paths from one package to another would not work either.
- If you change various packages, you may want a way to publish them all at the same time instead of one by one.

To resolve this issues, The (old) version we are using of Babel uses Lerna, a monorepo management tool. 
This has changed now. See the [Babel docs in the design section, branch v8.0.0-alpha.1](https://github.com/babel/babel/blob/release/v8.0.0-alpha.1/doc/design/monorepo.md?plain=1). I believe they are using [Yarn workspaces now](https://yarnpkg.com/features/workspaces).

Before we continue, take into consideration the next two things:
- Packages are registered in [Lerna's configuration file](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/lerna.json#L43). [Babel 7.10 has registered the directory `packages`](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/lerna.json#L43), `codemods` and `eslint` folders, so all subdirectories under `packages` are considered npm packages.
- We consider that a package is an internal dependency if it is registered in the configuration file.

Another important thing of `lerna.json` is that it let us prepare some flags for Lerna's commands. For example, maybe we want to use `--ignore-changes` with `lerna publish` to ignore the changes of some files to not publish them. In this case, [we can add the following to the configuration file](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/lerna.json#L19-L33):

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
The `ignoreChanges` flag  uses a glob expression like:

```
"packages/@(!(babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser))/**"
```

Here's what each part means:

1. `packages/`: This matches the "packages" directory.
2. `@(...)`: This is an extended glob pattern that matches exactly one occurrence of the patterns inside the parentheses.
3. `!(...)`: This is a negation pattern. It matches anything that does not match the patterns inside the parentheses.
4. `babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser`: These are the specific package names being excluded, separated by `|` (OR operator).
5. `/**`: This matches any file or directory recursively under the matched directory.

Putting it all together, this glob pattern means:

*"Match all files and directories recursively within any subdirectory of 'packages', except for 'babel-plugin-left-side-plugin', 'babel-plugin-left-side-support', and 'babel-parser'."*

In other words, it includes everything in the "packages" directory and its subdirectories, but explicitly excludes the three named packages and their contents.

Again, remember that Babel [does not use Lerna anymore](https://github.com/babel/babel/discussions/12622).
The problems that Babel 7.10 solves with Lerna [can be solved with workspaces](https://lerna.js.org/docs/legacy-package-management).

### lerna bootstrap

Installs the dependencies of every package.

Internal dependencies are symlinked if needed. For external dependencies, `npm install` is used.

[Reference.](https://github.com/lerna/lerna/tree/main/libs/commands/bootstrap)

### lerna publish

Publishes every registered package (as long as it is public).
There are a few alternatives when publishing:

- [lerna publish](https://github.com/lerna/lerna/tree/main/libs/commands/publish#readme). Publishes packages that have changed since the last release.
- Babel's 7.10 way: `lerna publish from-git`. The packages that have been tagged in the current commit are published. Packages are tagged by running [lerna version](https://github.com/lerna/lerna/tree/main/libs/commands/publish#readme). 
  - In [Babel's makefile](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/Makefile#L222-L224) there is a `make new-version` action:
  
    ```makefile
    new-version:
      git pull --rebase
      $(YARN) lerna version --force-publish=$(FORCE_PUBLISH)
    ```
   - [`lerna version`](https://github.com/lerna/lerna/tree/main/libs/commands/version) changes the version of the packages if they have been modified and then they are pushed to the remote repository.
- `lerna publish from-package`. The `package.json` version of each package is checked. If it is not published in the registry, the version is published.

[Reference.](https://github.com/lerna/lerna/tree/main/libs/commands/publish)

## Gulp and Rollup

### Gulp

Gulp is similar to Make: both are used to automate tasks. The major diference is that Gulp is written in JavaScript. In the case of Babel, it is used to build the project, since Babel is written in Flow. The [Gulpfile.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/Gulpfile.js) of the project (the "makefile" of Gulp), has some tasks registered:

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

### Rollup

[Rollup](https://rollupjs.org/introduction/#the-why) is a bundler: it takes a project and writes it in one single JS file, with the option to choose the output. Is like webpack but Rollup is primarily designed for bundling JavaScript libraries and frameworks and has
tree shaking (dead code elimination) as a core feature. This is why Babel uses it instead of Webpack.


### The use of Flow in Babel

If we take a look at the previous tasks there is an option to `build-no-bundle` which does not use Rollup. It uses `babel()` which is a tool, called `gulp-babel`, 
created [to integrate Babel and Gulp](https://github.com/babel/gulp-babel/tree/v7-maintenance). 
`gulp-babel` uses `@babel/core` to transform the given code. 
[So Babel compiles itself](https://en.wikipedia.org/wiki/Bootstrapping_(compilers))? If we check Babel's 7.10 configuration file ([babel.config.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/pablo-tfg/babel.config.js#L98-L112) we can see the following:

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

Let's say we want to modify and/or create packages in the Babel repository and then publish them. In my case ([@PSantanaGlez13](https://github.com/PSantanaGlez13)), I changed the `babel-parser` and created two additional packages with a plugin and support for that plugin. 

- [packages/babel-parser](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg/packages/babel-parser)
- [packages/babel-plugin-left-side-plugin](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg/packages/babel-plugin-left-side-plugin)
- [packages/babel-plugin-left-side-support](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg/packages/babel-plugin-left-side-support)

### lerna.json modifications

When trying to publish, I modified the [lerna.json](https://lerna.js.org/docs/api-reference/configuration) to ignore packages that are not mine 

`➜  babel-tanhauhau-pablo git:(pablo) cat lerna.json`
```json
{
  "version": "7.10.2",
  "changelog": {
    "repo": "babel/babel",
    "cacheDir": ".changelog",
    "labels": {
      "PR: Spec Compliance :eyeglasses:": ":eyeglasses: Spec Compliance",
      "PR: Breaking Change :boom:": ":boom: Breaking Change",
      "PR: New Feature :rocket:": ":rocket: New Feature",
      "PR: Bug Fix :bug:": ":bug: Bug Fix",
      "PR: Polish :nail_care:": ":nail_care: Polish",
      "PR: Docs :memo:": ":memo: Documentation",
      "PR: Internal :house:": ":house: Internal",
      "PR: Performance :running_woman:": ":running_woman: Performance",
      "PR: Revert :leftwards_arrow_with_hook:": ":leftwards_arrow_with_hook: Revert"
    }
  },
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
    },
    "version": {
      "ignoreChanges": [
        "packages/@(!(babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser))/**"
      ]
    }
  },
  "packages": [
    "codemods/*",
    "eslint/*",
    "packages/*"
  ],
  "npmClient": "yarn",
  "npmClientArgs": [
    "--pure-lockfile"
  ]
}
```
(another option could be to set all the other packages to private so Lerna won't publish them unless you force it to). 

Here are the changes I made to the `lerna.json` file. We have changed 
- the section `command.publish.ignoreChanges` to ignore all the packages that are not the ones we want to publish. 
- We also added a section `command.version.ignoreChanges` to ignore the changes of the packages we do not want to publish. 
  This is useful because we can run `lerna version` to bump the version of the packages and then `lerna publish from-git` to publish them:

```
➜  babel-tanhauhau-pablo git:(pablo) git lg | head -n 1
099c2a368 - (HEAD -> pablo, origin/pablo-tfg) Test Suite package WIP (hace 4 días PSantanaGlez13)
➜  babel-tanhauhau-pablo git:(pablo) git -P diff b0350e5b1 lerna.json
```

```diff
diff --git a/lerna.json b/lerna.json
index f466f26e3..ce485c8eb 100644
--- a/lerna.json
+++ b/lerna.json
@@ -26,7 +26,14 @@
         "# We ignore every JSON file, except for native-modules, built-ins and plugins defined in babel-preset-env/data.",
         "@(!(native-modules|built-ins|plugins|package)).json",
         "# Until the ESLint packages version are aligned with Babel's, we ignore them",
-        "eslint/**"
+        "eslint/**",
+        "# Making sure we only upload the function assignment (left side) packages",
+        "packages/@(!(babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser))/**"
+      ]
+    },
+    "version": {
+      "ignoreChanges": [
+        "packages/@(!(babel-plugin-left-side-plugin|babel-plugin-left-side-support|babel-parser))/**"
       ]
     }
   },
```

### make publish. Tests don't pass

However, publishing from the Makefile as it is runs linting tests, and because I changed the parser, my tests were considered errors and would not allow my packages to be published. Here is a summary of the Makefile's `publish` action. We can see  that it makes a `bootstrap-only` and a `build` before publishing. 

```sh
➜  babel-tanhauhau-pablo git:(pablo) make -n publish
/Applications/Xcode.app/Contents/Developer/usr/bin/make bootstrap-only
/Applications/Xcode.app/Contents/Developer/usr/bin/make prepublish-build
NODE_ENV=production BABEL_ENV=production /Applications/Xcode.app/Contents/Developer/usr/bin/make build
/Applications/Xcode.app/Contents/Developer/usr/bin/make generate-standalone generate-type-helpers
/Applications/Xcode.app/Contents/Developer/usr/bin/make build-dist
/Applications/Xcode.app/Contents/Developer/usr/bin/make build-standalone
/Applications/Xcode.app/Contents/Developer/usr/bin/make clone-license
/Applications/Xcode.app/Contents/Developer/usr/bin/make clean
```

### make new-version 

Even after removing the tests, my packages still would not publish. The reason for this is that we need to run `make new-version` first. 

```sh
➜  babel-tanhauhau-pablo git:(pablo) make -n new-version
git pull --rebase
yarn --silent lerna version --force-publish="@babel/runtime,@babel/runtime-corejs2,@babel/runtime-corejs3,@babel/standalone"
```

This will run `lerna version` which will bump the version of the packages one version up and then tag them so `lerna publish from-git` (called by `make publish`) will publish them. The issue with this is that all packages are being considered changed, so they will all be tagged and then, when publishing, they will appear as new packages.

### make bootstrap; npx lerna publish from-package

The solution to this issue is to use `make bootstrap; npx lerna publish from-package`. 

The first part is needed to build the project itself before publishing (remember that `make bootstrap` runs `make build`) and the second part publishes the packages that are not found in the publishing registry. 

This means that, since Babel's packages are already published, we can publish only the packages we want. 

### Different versions for each package?

On the other hand, because `lerna version` will try to update all the packages' version we may prefer to use other ways to change the version of our packages (perhaps `npm version` or, if they are few, we can handle them individually). 

Remember to configurate your `package.json` for each and every package you want to publish. This would be an example file:

`➜  babel-tanhauhau-pablo git:(pablo) cat packages/babel-plugin-left-side-plugin/package.json`

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
    "registry": "https://npm.pkg.github.com"
  },
  "author": "Pablo Santana Gonzalez <alu0101480541@ull.edu.es>",
  "license": "ISC",
  "gitHead": "df1dbf5d265ad3170234dff2e06cb385e08effc8"
}
```

While:

`➜  babel-tanhauhau-pablo git:(pablo) cat packages/babel-plugin-left-side-support/package.json`

```json
{
  "name": "@ull-esit-pl/babel-plugin-left-side-support",
  "version": "1.0.0",
  "description": "Support for the left side plugin",
  "main": "lib/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "callable-instance": "2.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg",
    "directory": "packages/babel-plugin-left-side-support"    
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://npm.pkg.github.com"
  },
  "author": "Pablo Santana Gonzalez <alu0101480541@ull.edu.es>",
  "license": "ISC",
  "gitHead": "df1dbf5d265ad3170234dff2e06cb385e08effc8"
}
```

You an see that the `version` is different for each package and you can check it in the [organization packages in GitHub](https://github.com/orgs/ULL-ESIT-PL/packages).

### publishConfig.access: public

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
```
> [!CAUTION]
> ```
> lerna ERR! E404 Not found
> error Command failed with exit code 1.
> info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
> ```


Notice that you have to run `npm login` to get a token and be able to publish packages. But it still fails. The reason I think this fails is because I do not have permissions in the npmjs organization I am trying to publish in and [to publish in a scope you need to be part of the organization](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages) (atleast for npmjs).

As an alternative, you can publish from the npm's GitHub registry.
To publish or install from the GitHub registry follow [these instructions](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

I ended up publishing from GitHub registry and it worked perfectly.

Now you should be able to install your package from any project. Keep in mind that if you are using the Github registry you will need to configure a `.npmrc` file and [get a GitHub personal access token](https://github.com/settings/tokens).

### In summary:

1. Configurate all the `package.json` files. Remember the scoped name if you want to use a scope (`publishConfig.access: "public"` for this case).
2. Run `make bootstrap` to install all dependencies, both external and internal. I suggest you try everything is working before the next step by trying your packages.
3. Run `npx lerna publish from-package`. Check that the packages that are shown are the correct ones. If publishing fails, check the org and registry you are trying to publish on.

If you are using the GitHub registry, check [Github's tutorial](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). Specially the part about [publishing multiple packages on the same repository](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#publishing-multiple-packages-to-the-same-repository). See the `repository.url` key in the `package.json` files above!.

### Note about using the packages.

Watch out when installing `babel-cli` to run `npx babel`. In npmjs there are two versions: the old one, which is [babel-cli](https://www.npmjs.com/package/babel-cli), and [@babel/babel-cli](https://www.npmjs.com/package/@babel/cli). The first one is Babel 6 and does not allow for some features you may have used (for example, `parserOverride` for your plugin) and the second one is Babel 7.

## Installing the left-side module 

See the instructions at repo [ULL-ESIT-PL/babel-left-side-npm-test](https://github.com/ULL-ESIT-PL/babel-left-side-npm-test/tree/main) to know how to install Pablo's [@ull-esit-pl/parser-left-side ](https://github.com/orgs/ULL-ESIT-PL/packages/npm/package/parser-left-side) set of packages [published in the GitHub registry](https://github.com/orgs/ULL-ESIT-PL/packages) inside the ull-esit-pl organization.

### References

- https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg
- https://github.com/ULL-ESIT-PL/babel-learning/tree/main
