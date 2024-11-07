import {parse} from "../lib";

function getParser(code) {
  return () => parse(code, {sourceType: "module"});
}

describe("left side function assignment", function() {
  it("should parse", function() {
    expect(getParser("foo(5) = 10")()).toMatchSnapshot();
  });
  /*
  it("should not parse", function() {
    expect(getParser("foo.bar(5) = 10")()).toMatchSnapshot();
  });
  */
});