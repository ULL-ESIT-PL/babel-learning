## Building and publishing processes in Babel.
## Makefile
There is a lot of actions in Babel's Makefile. We are going to cover mainly three of them (although these call other actions, but we will describe their overall behaviour).
1. `make bootstrap`. Installs all dependences for all packages using `lerna bootstrap` (more on Lerna later). After installing dependencies, `make build` is run. 
2. `make build`. Babel uses Flow so there is a need to compile the project into plain JavaScript. To do two packages are used: `gulp` and `rollup` (more on them later).
3. `make publish`. Babel's packages are published with Lerna. Some tests are run to ensure that the uploaded code complies with Babel's linting rules.

## Lerna
Babel is a monorepo, so all packages are in the same repository. A few issues arise from this:
- Installing dependencies for each of these packages can be a hard task. Specially with how many packages Babel has, there is a need of automating the installation of dependencies of each package, since just using `npm install` won't cut it.
- The internal dependencies between packages within the same repo also need to be resolved. Let us say that we want to install `@babel/parser` from `@babel/babel-core`. If we installed the dependency from a registry like npm, the version of the parser could not reflect the current state of the package if it has not been published. Also there is no need to install a package that we already have in our repository. Using relative paths from one package to another would not work neither.
- If you change various packages, you may want a way to publish them all at the same time instead of one by one.

To resolve this issues, Babel uses Lerna, a monorepo management tool. Before we continue, take into consideration the next two things:
- Packages are registered in Lerna's configuration file `lerna.json`. Babel has registered the directory `packages`, so all subdirectories are considered packages.
- We consider that a package is an internal dependency if it is registered in the configuration file.

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
