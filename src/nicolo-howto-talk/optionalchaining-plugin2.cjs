//const generate = require('@babel/generator').default;
module.exports = function myPlugin(babel, options) {
  const { types: t, template } = babel;
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression: {
        exit(path, state) {
          if (!path.node?.optional) return;
          let { object, property, computed } = path.node;

          let tmp = path.scope.generateUidIdentifierBasedOnNode(property);
          path.scope.push({ id: tmp, kind: 'let', init: t.NullLiteral() });

          let memberExp = t.memberExpression(tmp, property, computed);
          
          if (state?.opts?.loose) { 
            return path.replaceWith(template.expression.ast`(${tmp} = ${object}) && ${memberExp}`)
          }

          let undef = path.scope.buildUndefinedNode();
          path.replaceWith(
            template.expression.ast`
             (${tmp} = ${object}) == null? ${undef} :
             ${memberExp}
          `
          )
        }
      }
    }
  }
}