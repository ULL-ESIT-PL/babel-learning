module.exports = function(babel) {
  return {
    visitor: {
      Literal: function(path) {
          path.node.value = "Hi";
      }
    }
  };
}