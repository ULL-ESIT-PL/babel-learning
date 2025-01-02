import util from 'util';
const inspect = x => util.inspect(x, { depth: 3 });
let emitWarning = true;
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {
        let varName = state.opts.varName;
        let node = path.node;
        if (node.name !== varName) { return; }
        if (!path.scope.hasBinding(varName) && emitWarning) {
          console.error(`Variable "${varName}" not declared at line ${node.loc.start.line}. Declared variables: ${inspect(Object.keys(path.scope.bindings))}`);
          emitWarning = false; // Avoid spamming the console
        } else if (emitWarning) {
          console.error(`Variable "${varName}" declared at line ${node.loc.start.line}.`);
          emitWarning = false; 
        }
        return;
      }
    }
  };
}