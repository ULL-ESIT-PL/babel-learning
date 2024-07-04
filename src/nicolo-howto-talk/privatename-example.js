class Counter {
  #x = 0;

  click() {
    this.#x++;
  }

  constructor() {
    this.#x = 0;
  }

  render() {
    return this.#x.toString();
  }
}

const counter = new Counter();
counter.click();
console.log(counter.render()); // 1