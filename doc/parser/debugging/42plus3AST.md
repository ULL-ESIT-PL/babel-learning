## examples/simple2.js

`➜  babel-parser git:(learning) ✗ cat examples/simple2.js`
```js 

42+3
```

## Babel AST for `examples/simple2.js`

`➜  babel-parser git:(learning) ✗ bin/babel-parser.js examples/simple2.js`
```json
{
  "type": "File",
  "start": 0,
  "end": 4,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 4
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 4,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 4
      }
    },
    "sourceType": "script",
    "interpreter": null,
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 0,
        "end": 4,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 4
          }
        },
        "expression": {
          "type": "BinaryExpression",
          "start": 0,
          "end": 4,
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 4
            }
          },
          "left": {
            "type": "NumericLiteral",
            "start": 0,
            "end": 2,
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 2
              }
            },
            "extra": {
              "rawValue": 42,
              "raw": "42"
            },
            "value": 42
          },
          "operator": "+",
          "right": {
            "type": "NumericLiteral",
            "start": 3,
            "end": 4,
            "loc": {
              "start": {
                "line": 1,
                "column": 3
              },
              "end": {
                "line": 1,
                "column": 4
              }
            },
            "extra": {
              "rawValue": 3,
              "raw": "3"
            },
            "value": 3
          }
        }
      }
    ],
    "directives": []
  },
  "comments": [],
  "tokens": [
    {
      "type": {
        "label": "num",
        "beforeExpr": false,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null,
        "updateContext": null
      },
      "value": 42,
      "start": 0,
      "end": 2,
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 2
        }
      }
    },
    {
      "type": {
        "label": "+/-",
        "beforeExpr": true,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": true,
        "postfix": false,
        "binop": 9,
        "updateContext": null
      },
      "value": "+",
      "start": 2,
      "end": 3,
      "loc": {
        "start": {
          "line": 1,
          "column": 2
        },
        "end": {
          "line": 1,
          "column": 3
        }
      }
    },
    {
      "type": {
        "label": "num",
        "beforeExpr": false,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null,
        "updateContext": null
      },
      "value": 3,
      "start": 3,
      "end": 4,
      "loc": {
        "start": {
          "line": 1,
          "column": 3
        },
        "end": {
          "line": 1,
          "column": 4
        }
      }
    },
    {
      "type": {
        "label": "eof",
        "beforeExpr": false,
        "startsExpr": false,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null,
        "updateContext": null
      },
      "start": 4,
      "end": 4,
      "loc": {
        "start": {
          "line": 1,
          "column": 4
        },
        "end": {
          "line": 1,
          "column": 4
        }
      }
    }
  ]
}
```
