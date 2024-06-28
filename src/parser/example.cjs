const code = `const element : React.Element = <a href="https://www.google.com">Hello, world!</a>;`;
let parse = require("@babel/parser").parse;
let ast = parse(code, {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
  ],
});

const skip = (key, value) => {
  if (key === "loc" || key === "start" || key === "end" || key === "directives" || key === "comments") {
    return undefined;
  }
  return value;
}
console.log(JSON.stringify(ast, skip, 2));
/* Execution:
➜  babel-learning git:(main) node src/parser/example.cjs 
{
  "type": "File",
  "errors": [],
  "program": {
    "type": "Program",
    "sourceType": "module",
    "interpreter": null,
    "body": [
      {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "element",
              "typeAnnotation": {
                "type": "TypeAnnotation",
                "typeAnnotation": {
                  "type": "GenericTypeAnnotation",
                  "typeParameters": null,
                  "id": {
                    "type": "QualifiedTypeIdentifier",
                    "qualification": {
                      "type": "Identifier",
                      "name": "React"
                    },
                    "id": {
                      "type": "Identifier",
                      "name": "Element"
                    }
                  }
                }
              }
            },
            "init": {
              "type": "JSXElement",
              "openingElement": {
                "type": "JSXOpeningElement",
                "name": {
                  "type": "JSXIdentifier",
                  "name": "a"
                },
                "attributes": [
                  {
                    "type": "JSXAttribute",
                    "name": {
                      "type": "JSXIdentifier",
                      "name": "href"
                    },
                    "value": {
                      "type": "StringLiteral",
                      "extra": {
                        "rawValue": "https://www.google.com",
                        "raw": "\"https://www.google.com\""
                      },
                      "value": "https://www.google.com"
                    }
                  }
                ],
                "selfClosing": false
              },
              "closingElement": {
                "type": "JSXClosingElement",
                "name": {
                  "type": "JSXIdentifier",
                  "name": "a"
                }
              },
              "children": [
                {
                  "type": "JSXText",
                  "extra": {
                    "rawValue": "Hello, world!",
                    "raw": "Hello, world!"
                  },
                  "value": "Hello, world!"
                }
              ]
            }
          }
        ],
        "kind": "const"
      }
    ]
  }
}
*/