
# Scope Analysis

After parsing the body has finished, the scope analysis phase has also been completed. 

## src/util/scope.js: ClassScope and ClassScopeHandler

The code for the scope analysis associated with the parser seems to be in the folder [/packages/babel-parser/src/util](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/master/packages/babel-parser/src/util) 

```
babel-parser
└── src
     └── util
         ├── class-scope.js
         ├── identifier.js
         ├── location.js
         ├── production-parameter.js
         ├── scope.js
         ├── scopeflags.js
         └── whitespace.js
```

and mainly in the classes [Scope Class](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/util/scope.js#L22-34) and the class [ClassScopeHandler](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/util/scope.js#L40-L212) inside `src/util/scope.js`

### ClassScope

- `privateNames` is a `Set` of private named declared in the current class
- `undefinedPrivateNames` is a `Map` of private names used before being defined, mapping to their position.

```ts
export class ClassScope {
  privateNames: Set<string> = new Set();
  loneAccessors: Map<string, ClassElementTypes> = new Map(); // for getters and setters
  undefinedPrivateNames: Map<string, number> = new Map();
}
```

The `loneAccessors` attribute is for getters and setters.
Read [Property getters and setters](https://javascript.info/property-accessors#getters-and-setters) for a gentle introduction to getters and setters in JS.

### ClassScopeHandler

The class [ClassScopeHandler](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/util/scope.js#L40-L212):

```ts
export default class ClassScopeHandler {
  stack: Array<ClassScope> = [];
  raise: raiseFunction;
  undefinedPrivateNames: Map<string, number> = new Map();

  constructor(raise: raiseFunction) {
    this.raise = raise;
  }

  current(): ClassScope {
    return this.stack[this.stack.length - 1];
  }

  enter() {
    this.stack.push(new ClassScope());
  }

  exit() {
    const oldClassScope = this.stack.pop();

    // Migrate the usage of not yet defined private names to the outer
    // class scope, or raise an error if we reached the top-level scope.

    const current = this.current();

    // Array.from is needed because this is compiled to an array-like for loop
    for (const [name, pos] of Array.from(oldClassScope.undefinedPrivateNames)) {
      if (current) {
        if (!current.undefinedPrivateNames.has(name)) {
          current.undefinedPrivateNames.set(name, pos);
        }
      } else {
        this.raise(pos, Errors.InvalidPrivateFieldResolution, name);
      }
    }
  }

  declarePrivateName(
    name: string,
    elementType: ClassElementTypes,
    pos: number,
  ) {
    const classScope = this.current();
    let redefined = classScope.privateNames.has(name);

    if (elementType & CLASS_ELEMENT_KIND_ACCESSOR) {
      const accessor = redefined && classScope.loneAccessors.get(name);
      if (accessor) {
        const oldStatic = accessor & CLASS_ELEMENT_FLAG_STATIC;
        const newStatic = elementType & CLASS_ELEMENT_FLAG_STATIC;

        const oldKind = accessor & CLASS_ELEMENT_KIND_ACCESSOR;
        const newKind = elementType & CLASS_ELEMENT_KIND_ACCESSOR;

        // The private name can be duplicated only if it is used by
        // two accessors with different kind (get and set), and if
        // they have the same placement (static or not).
        redefined = oldKind === newKind || oldStatic !== newStatic;

        if (!redefined) classScope.loneAccessors.delete(name);
      } else if (!redefined) {
        classScope.loneAccessors.set(name, elementType);
      }
    }

    if (redefined) {
      this.raise(pos, Errors.PrivateNameRedeclaration, name);
    }

    classScope.privateNames.add(name);
    classScope.undefinedPrivateNames.delete(name);
  }

  usePrivateName(name: string, pos: number) {
    let classScope;
    for (classScope of this.stack) {
      if (classScope.privateNames.has(name)) return;
    }

    if (classScope) {
      classScope.undefinedPrivateNames.set(name, pos);
    } else {
      // top-level
      this.raise(pos, Errors.InvalidPrivateFieldResolution, name);
    }
  }
}
```
<!--
## src/parser/base.js: BaseParser

`scope.js` and `class-scope.js`  types are imported, reformatted and exported again by the [babel-parser/src/parser/base.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/parser/base.js#L7) module:

```ts
...
import type ScopeHandler from "../util/scope";
import type ClassScopeHandler from "../util/class-scope";

export default class BaseParser {
  // Properties set by constructor in index.js
  options: Options;       // Configurations options
  inModule: boolean;      // True if the code is in a module
  scope: ScopeHandler<*>; // Generic type
  classScope: ClassScopeHandler;
  ...

  state: State;  // Initialized by Tokenizer
  // input and length are not in state as they are constant and we do
  // not want to ever copy them, which happens if state gets cloned
  input: string;
  length: number;
  hasPlugin(name: string): boolean { return this.plugins.has(name); } // checks if a given plugin is available in the plugins map
  getPluginOption(plugin: string, name: string) { if (this.hasPlugin(plugin)) return this.plugins.get(plugin)[name]; } // Retrieves an option for a specified plugin
}
```

## src/parser/comments.js: CommentsParser Class

[The `BaseParser` class is imported by the `comments.js` module](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/parser/comments.js#L34) which adds the `CommentsParser` class to it:

```ts
import BaseParser from "./base";
...

export default class CommentsParser extends BaseParser { ... }
```

## error.js 

The `CommentsParser` class is imported by the `error.js` module. 

```
 src
  ├── parser
  │   ├── base.js
  │   ├── comments.js
  │   ├── error-message.js
  │   ├── error.js
  │   ├── expression.js
  │   ├── index.js
  │   ├── lval.js
  │   ├── node.js
  │   ├── statement.js
  │   └── util.js
```

The 
`ParserError` class inherits from the `CommentsParser`:

```ts
import { getLineInfo, type Position } from "../util/location";
import CommentsParser from "./comments";
type ErrorContext = {
  pos: number,
  loc: Position,
  missingPlugin?: Array<string>,
  code?: string,
};

export { ErrorMessages as Errors } from "./error-message.js";
export default class ParserError extends CommentsParser { ... }
```
-->

## src/parser/index.js: Parser Class

The `ScopeHandler` and `ClassScopeHandler` classes are imported by the `Parser` class in the [babel-parser/src/parser/index.js]() module:

```ts
import type { Options } from "../options";
import type { File /*::, JSXOpeningElement */ } from "../types";
import type { PluginList } from "../plugin-utils";
import { getOptions } from "../options";
import StatementParser from "./statement";
import { SCOPE_PROGRAM } from "../util/scopeflags";
import ScopeHandler from "../util/scope";
import ClassScopeHandler from "../util/class-scope";
import ProductionParameterHandler, { PARAM_AWAIT, PARAM, } from "../util/production-parameter";

export type PluginsMap = Map<string, { [string]: any }>;

export default class Parser extends StatementParser { ... } 
```