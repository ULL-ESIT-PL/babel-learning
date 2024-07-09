//const generate = require('@babel/generator').default;
module.exports = function myPlugin(babel, options) {
  const {types: t, template } = babel;
  return {
    name: "optional-chaining-plugin",
    manipulateOptions(opts) {
      opts.parserOpts.plugins.push("OptionalChaining")
    },
    visitor: {
      OptionalMemberExpression(path) {
        let { object, property, computed} = path.node;
        let tmp = path.scope.generateUidIdentifier('_obj');
        path.scope.push({id: tmp})
        let memberExp = t.memberExpression(object, property, computed);
        let undef = path.scope.buildUndefinedNode();
        path.replaceWith(
          template.expression.ast`
             ${object} == null? ${undef} :
             ${memberExp}
          `
        )
      } 
    }
  }
}