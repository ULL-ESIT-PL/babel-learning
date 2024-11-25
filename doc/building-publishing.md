## Building and publishing 


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
2. There is another way the Flow annotations are being dealt with. There is a `@babel/types` package which may have more info on this, but I have not dived into it yet.

## How to publish from a fork of Babel?

Let's say we want to modify and/or create packages in the Babel repository and then publish them. In my case ([@PSantanaGlez13](https://github.com/PSantanaGlez13)), I changed the `babel-parser` and created two additional packages with a plugin and support for that plugin. When trying to publish, I modified the `lerna.json` to ignore packages that are not mine (another option could be to set all the other packages to private so Lerna won't publish them unless you force it to). However, publishing from the Makefile as it is runs linting tests, and because I changed the parser, my tests were considered errors and would not allow my packages to be published.

Even after removing the tests, my packages still would not publish due to some error with Yarn. I need to recreate the issue to provide more details.