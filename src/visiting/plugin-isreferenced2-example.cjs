module.exports = function (babel) {
  const { types: t } = babel; // types: t is equivalent to types: babel.types

  return {
    name: "isreferenced2",
    
    visitor: {
      Identifier(path) {
        if (t.isReferenced(path.node, path.parent)) {
            console.log('referenced ',path.node.name, ' at line ',path.node.loc.start.line,' col ',path.node.loc.start.column );
        }
        else {
            console.log('declared ',path.node.name, ' at line ',path.node.loc.start.line,' col ',path.node.loc.start.column );
        }
      }
    }
  }
}
