See example [src/template/hello-babel-template.mjs](/src/template/hello-babel-template.mjs).

You can use two different kinds of placeholders: 
- syntactic placeholders (e.g. `%%name%%`) or 
- identifier placeholders (e.g. `NAME`). 

`@babel/template` supports both those approaches by default, but they can't be mixed. If you need to be explicit about what syntax you are using, you can use the `syntacticPlaceholders` option.
