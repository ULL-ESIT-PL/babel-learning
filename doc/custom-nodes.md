
# Custom Nodes in Babel.js 7.29

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