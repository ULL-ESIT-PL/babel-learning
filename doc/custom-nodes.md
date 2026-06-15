
# Custom Nodes in Babel.js 7.29

## Example: Defining and Traversing Custom Nodes

```js
// Using babel 7.29
const babelTraverse = require("@babel/traverse");
const t = require("@babel/types");

// Manejo de la exportación por defecto de Babel en CommonJS
const traverse = babelTraverse.default;


const { defineAliasedType, assertValueType, assertNodeType, assertEach } = require('@babel/types/lib/definitions/utils');
const defineType = defineAliasedType("Dragon"); // Estos hace que  la función devuelta defineType añade automáticamente "dragon" 
                                                // al arreglo de aliases de cualquier nodo que registres con ella.

if (!t.TYPES.includes('StructDeclaration')) {
  t.TYPES.push('StructDeclaration');
}
if (!t.TYPES.includes('StructField')) {
  t.TYPES.push('StructField');
}
defineType('StructDeclaration', {
  //builder: ['id', 'fields'], // No he logrado poner en marcha que se generen constructores automáticos
  visitor: ['id', 'fields'],
  aliases: ['Statement', 'Declaration'], // isStatement, isDeclaration
  fields: {
    id: { validate: assertNodeType('Identifier') },
    fields: { validate: assertEach(assertNodeType('StructField')) },
  },
});

defineType('StructField', {
  //builder: ['id', 'value'],
  visitor: ['id', 'value'],
  aliases: ['Statement'],
  fields: {
    id: { validate: assertIsIdentifier },
    value: { validate: assertNodeType('Expression') },
  },
});
// const builder = require('@babel/types/lib/validators/validate')

function assertIsIdentifier(node, key, val) {
  if (!val || val.type !== 'Identifier') {
    throw new TypeError(`Property ${key} of ${node.type} expected an Identifier node, got ${val?.type}`);
  }
}

t.isStructDeclaration = (node, opts) => t.is('StructDeclaration', node, opts);
t.isStructField = (node, opts) => t.is('StructField', node, opts);
t.isDragon = (node, opts) => t.is('Dragon', node, opts);

const myAST = {
  type: "Program",
  body: [
    {
      type: "StructDeclaration",
      id: { type: "Identifier", name: "MyStruct" },
      fields: [
        {
          type: "StructField",
          id: { type: "Identifier", name: "field1" },
          value: { type: "NumericLiteral", value: 5 }
        }
      ]
    }
  ],
  sourceType: "module"
};

// Traverse ahora puede recorrer tu estructura sin romperse
traverse(myAST, {

    StructDeclaration(path) {
        console.log("¡Nodo StructDeclaration detectado con éxito!");
        console.log(t.is('StructDeclaration', path.node)); // true
        console.log(t.is('Dragon', path.node)); // true 
        console.log(t.isDragon(path.node)); // true
        // Comprobamos que las propiedades son accesibles mediante paths de Babel
        const idPath = path.get("id");
        console.log("Nombre del struct:", idPath.node.name);
    },
    
    StructField(path) {
        console.log("¡Nodo StructField detectado con éxito!");
        console.log(t.is('StructField', path.node)); // true
        console.log(t.is('Dragon', path.node)); // true
        const idPath = path.get("id");
        console.log("Nombre del campo:", idPath.node.name);
    },

    Identifier(path) {
        // Traverse llega aquí automáticamente gracias a las VISITOR_KEYS definidas
        console.log("Visitando identificador interno:", path.node.name);
    }

});

//console.log(t.structField({ type: "Identifier", name: "field1" }, { type: "NumericLiteral", value: 5 })); // does not exist!
```

```
➜  compilers-introduction git:(dev) ✗ node docs/types/structs/src/definetypes2.cjs
¡Nodo StructDeclaration detectado con éxito!
true
true
true
Nombre del struct: MyStruct
Visitando identificador interno: MyStruct
¡Nodo StructField detectado con éxito!
true
true
Nombre del campo: field1
Visitando identificador interno: field1
```

##  

```js 
// This file demonstrates how to define a custom AST node type and configure Babel to traverse it.
// It also shows how to create an AST that includes the custom node and how to write 
// a visitor that handles it. This is an unofficial hack. Babel does not offer a stable public API for extending arbitrary types.
// This can break between versions.

const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

// 1. Define the new node type and its child properties
// Babel will inspect these properties to continue deep traversal
t.TYPES.push("MyCustomNode");
t.VISITOR_KEYS.MyCustomNode = [
  "childPropertyA",
  "childPropertyB"
];

// 2. Create an AST structure that uses the new node
const customAST = {
  type: "Program",
  body: [
    {
      type: "MyCustomNode",

      // Child properties (Babel will traverse these automatically)
      childPropertyA: {
        type: "Identifier",
        name: "internalVariable"
      },

      childPropertyB: {
        type: "StringLiteral",
        value: "test text"
      },

      // Regular property that will NOT be traversed
      // because it is not listed in VISITOR_KEYS
      metadataInfo: "control information"
    }
  ],
  sourceType: "module"
};

// 3. Configure the visitor including the new node type
const myVisitor = {
  MyCustomNode(path) {
    console.log("Custom node found!");
  },

  Identifier(path) {
    console.log(`Visiting child identifier: ${path.node.name}`);
  }
};

// 4. Run the traversal
traverse(customAST, myVisitor);
```

Execution:

```
➜  compilers-introduction git:(dev) ✗ node bin/personalized-node.cjs 
Custom node found!
Visiting child identifier: internalVariable
```