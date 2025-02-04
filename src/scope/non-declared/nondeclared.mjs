export default function () {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          let varName = state.opts.varName;
          console.log(`Searching for variable "${varName}"`);
          state.nonDeclared = new Map();
          state.Declared = new Map();
        },
        exit(path, state) {
          state.Declared.forEach((value, key) => { console.log(key, value); });
          state.nonDeclared.forEach((value, key) => { console.log(key, value); });
          process.exit(0);
        }
      },
      Identifier(path, state) {
        let varName = state.opts.varName;
        let node = path.node;
        if (node.name !== varName) { return; }
        if (!path.scope.hasBinding(varName)) {
          state.nonDeclared.set(`${varName} at ${node.loc.start.line}`, `is not declared.`)
          return
        }
        state.Declared.set(`${varName} at ${node.loc.start.line}`, `is declared.`);
        return;
      },
    }
  };
}