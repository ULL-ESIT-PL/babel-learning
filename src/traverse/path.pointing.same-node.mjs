import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;
import * as t from '@babel/types';

const id = t.identifier("x");

const ast = t.file(
  t.program([
    t.expressionStatement(id),
    //t.expressionStatement(id), // A DAG: Bad idea. Avoid this pattern!
    t.expressionStatement(t.identifier("x")),

  ])
);

let path1, path2;

traverse(ast, {
  Identifier(path) {
    if (!path1) path1 = path;
    else path2 = path;
  }
});

console.log(path1 === path2);           // false
console.log(path1.node === path2.node); // true