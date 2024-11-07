# Pablo's function expressions on the left side of the assignment

You can find Pablo's current (2024-11-07) implementation of function expressions on the left side of the assignment
[pablo-tfg branch](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg/packages/babel-parser) of the `ULL-ESIT-PL/babel-tanhauhau` repo. 

> [!IMPORTANT]
> **Warning: This is work in progress. These comments can be outdated.**

Here I am using the `pabloparser` and `pablobabel` links to compile the code:


`➜  left-side git:(main) ✗ cat left-side-original.mjs`
```js
//foo.assign(10, 9) Alternative, defining assignable functions.
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;
```
  
When compiled with [Pablo's parser]() we get an AST like:
  
``` 
➜  left-side git:(main) ✗ npx pabloparser left-side-original.mjs
{
  "type": "File",
  "start": 0,
  "end": 119,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 5,
      "column": 12
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 119,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 5,
        "column": 12
      }
    },
    "sourceType": "script",
    "interpreter": null,
    "body": [
      {
        "type": "FunctionDeclaration",
        "start": 64,
        "end": 106,
        "loc": {
          "start": {
            "line": 2,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 1
          }
        },
        "id": {
          "type": "Identifier",
          "start": 76,
          "end": 79,
          "loc": {
            "start": {
              "line": 2,
              "column": 12
            },
            "end": {
              "line": 2,
              "column": 15
            },
            "identifierName": "foo"
          },
          "name": "foo"
        },
        "generator": false,
        "async": false,
        "assignable": true,
        "params": [
          {
            "type": "Identifier",
            "start": 80,
            "end": 83,
            "loc": {
              "start": {
                "line": 2,
                "column": 16
              },
              "end": {
                "line": 2,
                "column": 19
              },
              "identifierName": "bar"
            },
            "name": "bar"
          }
        ],
        "body": {
          "type": "BlockStatement",
          "start": 85,
          "end": 106,
          "loc": {
            "start": {
              "line": 2,
              "column": 21
            },
            "end": {
              "line": 4,
              "column": 1
            }
          },
          "body": [
            {
              "type": "ReturnStatement",
              "start": 89,
              "end": 104,
              "loc": {
                "start": {
                  "line": 3,
                  "column": 2
                },
                "end": {
                  "line": 3,
                  "column": 17
                }
              },
              "argument": {
                "type": "BinaryExpression",
                "start": 96,
                "end": 103,
                "loc": {
                  "start": {
                    "line": 3,
                    "column": 9
                  },
                  "end": {
                    "line": 3,
                    "column": 16
                  }
                },
                "left": {
                  "type": "Identifier",
                  "start": 96,
                  "end": 99,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 9
                    },
                    "end": {
                      "line": 3,
                      "column": 12
                    },
                    "identifierName": "bar"
                  },
                  "name": "bar"
                },
                "operator": "*",
                "right": {
                  "type": "NumericLiteral",
                  "start": 102,
                  "end": 103,
                  "loc": {
                    "start": {
                      "line": 3,
                      "column": 15
                    },
                    "end": {
                      "line": 3,
                      "column": 16
                    }
                  },
                  "extra": {
                    "rawValue": 2,
                    "raw": "2"
                  },
                  "value": 2
                }
              }
            }
          ],
          "directives": []
        },
        "leadingComments": [
          {
            "type": "CommentLine",
            "value": "foo.assign(10, 9) Alternative, defining assignable functions.",
            "start": 0,
            "end": 63,
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 63
              }
            }
          }
        ]
      },
      {
        "type": "ExpressionStatement",
        "start": 107,
        "end": 119,
        "loc": {
          "start": {
            "line": 5,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 12
          }
        },
        "expression": {
          "type": "AssignmentExpression",
          "start": 107,
          "end": 118,
          "loc": {
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 11
            }
          },
          "operator": "=",
          "left": {
            "type": "CallExpression",
            "start": 107,
            "end": 114,
            "loc": {
              "start": {
                "line": 5,
                "column": 0
              },
              "end": {
                "line": 5,
                "column": 7
              }
            },
            "callee": {
              "type": "Identifier",
              "start": 107,
              "end": 110,
              "loc": {
                "start": {
                  "line": 5,
                  "column": 0
                },
                "end": {
                  "line": 5,
                  "column": 3
                },
                "identifierName": "foo"
              },
              "name": "foo"
            },
            "arguments": [
              {
                "type": "NumericLiteral",
                "start": 111,
                "end": 113,
                "loc": {
                  "start": {
                    "line": 5,
                    "column": 4
                  },
                  "end": {
                    "line": 5,
                    "column": 6
                  }
                },
                "extra": {
                  "rawValue": 10,
                  "raw": "10"
                },
                "value": 10
              }
            ]
          },
          "right": {
            "type": "NumericLiteral",
            "start": 117,
            "end": 118,
            "loc": {
              "start": {
                "line": 5,
                "column": 10
              },
              "end": {
                "line": 5,
                "column": 11
              }
            },
            "extra": {
              "rawValue": 5,
              "raw": "5"
            },
            "value": 5
          }
        }
      }
    ],
    "directives": []
  },
  "comments": [
    {
      "type": "CommentLine",
      "value": "foo.assign(10, 9) Alternative, defining assignable functions.",
      "start": 0,
      "end": 63,
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 63
        }
      }
    }
  ]
}
```
