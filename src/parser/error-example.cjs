const { parse } = require("@babel/parser");

const ast = parse(`a b`, { errorRecovery: true });

console.log(ast.errors[0].code); // BABEL_PARSER_SYNTAX_ERROR
console.log(ast.errors[0].reasonCode); // MissingSemicolon
console.log(JSON.stringify(
  ast, 
  (key, value) => { return ['loc', 'start', 'end', 'directives', 'comments'].includes(key) ? undefined : value },
  2)
); /* Notice how some AST is still generated despite the syntax error:
{
  "type": "File",
  "errors": [
    {
      "code": "BABEL_PARSER_SYNTAX_ERROR",
      "reasonCode": "MissingSemicolon",
      "pos": 1
    }
  ],
  "program": {
    "type": "Program",
    "sourceType": "script",
    "interpreter": null,
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "Identifier",
          "name": "a"
        }
      },
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "Identifier",
          "name": "b"
        }
      }
    ]
  }
*/