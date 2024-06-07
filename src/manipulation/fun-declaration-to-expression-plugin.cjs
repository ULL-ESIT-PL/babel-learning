module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "learning-toExpression", // nombre del plugin
    visitor: {
      FunctionDeclaration(path) {
        let node = path.node;
        let name = node.id.name;
        node.id = null;
        let r = path.replaceWith(
          t.assignmentExpression(
            "=",
            t.identifier(name),
            t.toExpression(node)
          ))
          idPath = null;
        //console.log(r[0].node.left.name); 
      } 
    }
  }
};