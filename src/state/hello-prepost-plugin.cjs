module.exports = function({ types: t }) {
  return {
    pre(state) {
      this.numbers = new Set();
    },
    visitor: {
      NumericLiteral(path) {
        this.numbers.add(path.node.value);
      }
    },
    post(state) {
      console.log(this.numbers);
    }
  };
}