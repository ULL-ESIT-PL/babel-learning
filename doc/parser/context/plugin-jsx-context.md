# Plugin jsx: Usage of token contexts

File [src/plugins/jsx/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/plugins/jsx/index.js) defines the plugin `jsx`. This plugin is enabled by default. It is used to parse JSX syntax. The plugin uses token contexts to define the different contexts in which tokens can appear. The plugin defines the following token contexts:

```js
...
import { TokContext, types as tc } from "../../tokenizer/context";
...
// Be aware that this file is always executed and not only when the plugin is enabled.
// Therefore this contexts and tokens do always exist.
tc.j_oTag = new TokContext("<tag", false);
tc.j_cTag = new TokContext("</tag", false);
tc.j_expr = new TokContext("<tag>...</tag>", true, true);
tt.jsxName = new TokenType("jsxName");
tt.jsxText = new TokenType("jsxText", { beforeExpr: true });
tt.jsxTagStart = new TokenType("jsxTagStart", { startsExpr: true });
tt.jsxTagEnd = new TokenType("jsxTagEnd");

tt.jsxTagStart.updateContext = function () {
  this.state.context.push(tc.j_expr); // treat as beginning of JSX expression
  this.state.context.push(tc.j_oTag); // start opening tag context
  this.state.exprAllowed = false;
};
...
updateContext(prevType: TokenType): void {
      if (this.match(tt.braceL)) {
        const curContext = this.curContext();
        if (curContext === tc.j_oTag) {
          this.state.context.push(tc.braceExpression);
        } else if (curContext === tc.j_expr) {
          this.state.context.push(tc.templateQuasi);
        } else {
          super.updateContext(prevType);
        }
        this.state.exprAllowed = true;
      } else if (this.match(tt.slash) && prevType === tt.jsxTagStart) {
        this.state.context.length -= 2; // do not consider JSX expr -> JSX open tag -> ... anymore
        this.state.context.push(tc.j_cTag); // reconsider as closing tag context
        this.state.exprAllowed = false;
      } else {
        return super.updateContext(prevType);
      }
    }
  };
```
