# Babel monorepo git configuration: Husky and git Hooks

## The problem 

The Babel monorepo project uses [Husky](https://typicode.github.io/husky) to manage git hooks:

`➜  babel-tanhauhau git:(learning) ✗ jq '.husky' package.json`
```json
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

Husky is a tool that simplifies the setup and management of pre-commit hooks. 
The pre-commit hook is run first, before you even type in a commit message. 
It's used to inspect the snapshot that's about to be committed, to see if you've forgotten something, 
to make sure tests run, or to examine whatever you need to inspect in the code.
The goal of pre-commit hooks is to improve the quality of commits. 

## git --no-verify

> [!IMPORTANT]
> To skip commit hooks during a commit, you can use the `--no-verify` option (a.k.a. `-n`) 
with `git commit`. This option bypasses both the pre-commit and commit-msg hooks:
>
> ```sh
> ➜  babel-tanhauhau git:(learning) ✗ git commit -nam 'added .vscode/settings.json to allow typescript annotations > in  .js extension'
> ```

## Alternative: Disabling Husky and git Hooks 

In the [package.json](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/package.json#L88-L92) at the root of the project, you will find the husky configuration. We can disable husky by removing it or changing the lines:

```diff
diff --git a/package.json b/package.json
index 1b63836e5..5e50abba8 100644
--- a/package.json
+++ b/package.json
@@ -85,7 +85,7 @@
       "eslint --format=codeframe"
     ]
   },
-  "husky": {
+  "husky-disabled": {
     "hooks": {
       "pre-commit": "lint-staged"
     }
```