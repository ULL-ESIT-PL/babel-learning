# git configuration: Husky and git Hooks

The Babel project uses [Husky](https://typicode.github.io/husky) to manage git hooks:

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

To skip commit hooks during a commit, you can use the `--no-verify` option (a.k.a. `-n`) 
with `git commit`. This option bypasses both the pre-commit and commit-msg hooks:

```sh
➜  babel-tanhauhau git:(learning) ✗ git commit -nam 'added .vscode/settings.json to allow typescript annotations in  .js extension'
```
