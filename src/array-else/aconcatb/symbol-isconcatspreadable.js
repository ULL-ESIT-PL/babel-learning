const x = [1, 2, 3];

const fakeArray = {
  [Symbol.isConcatSpreadable]: true,
  length: 2,
  0: "hello",
  1: "world",
};

console.log(
    x.concat(fakeArray) // [1, 2, 3, "hello", "world"]
);
