## parseSubscript

In `packages/babel-parser/src/expression.js` we have the `parseSubscript` method inside the class `ExpressionParser`
which is in charge of parsing the subscript expressions. 

```js
  /**
   * @param state Set 'state.stop = true' to indicate that we should stop parsing subscripts.
   *   state.optionalChainMember to indicate that the member is currently in OptionalChain
   */
  parseSubscript(
    base: N.Expression,
    startPos: number, startLoc: Position,
    noCalls: ?boolean,
    state: N.ParseSubscriptState,
    maybeAsyncArrow: boolean,
  ): N.Expression {
    if (!noCalls && this.eat(tt.doubleColon)) { // S.t. like a::b a binding expression
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.callee = this.parseNoCallExpr();
      state.stop = true;
      return this.parseSubscripts(
        this.finishNode(node, "BindExpression"),
        startPos,
        startLoc,
        noCalls,
      );
    } else if (this.match(tt.questionDot)) { // S.t. like a?.b
      this.expectPlugin("optionalChaining");
      state.optionalChainMember = true;
      if (noCalls && this.lookahead().type === tt.parenL) { // S.t. like a?.(0)
        state.stop = true;
        return base;
      }
      this.next();

      const node = this.startNodeAt(startPos, startLoc);

      if (this.eat(tt.bracketL)) { // S.t. like a?.[0]
        node.object = base;
        node.property = this.parseExpression();
        node.computed = true;
        node.optional = true;
        this.expect(tt.bracketR);
        return this.finishNode(node, "OptionalMemberExpression");
      } else if (this.eat(tt.parenL)) { // S.t. like a?.(0)
        node.callee = base;
        node.arguments = this.parseCallExpressionArguments(tt.parenR, false);
        node.optional = true;
        return this.finishNode(node, "OptionalCallExpression");
      } else { // S.t. like a?.b
        node.object = base;
        node.property = this.parseIdentifier(true);
        node.computed = false;
        node.optional = true;
        return this.finishNode(node, "OptionalMemberExpression");
      }
    } else if (this.eat(tt.dot)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = this.parseMaybePrivateName();
      node.computed = false;
      if (state.optionalChainMember) {
        node.optional = false;
        return this.finishNode(node, "OptionalMemberExpression");
      }
      return this.finishNode(node, "MemberExpression");
    } else if (this.eat(tt.bracketL)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = this.parseExpression();
      node.computed = true;
      this.expect(tt.bracketR);
      if (state.optionalChainMember) {
        node.optional = false;
        return this.finishNode(node, "OptionalMemberExpression");
      }
      return this.finishNode(node, "MemberExpression");
    } else if (!noCalls && this.match(tt.parenL)) {
      const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      const oldYieldPos = this.state.yieldPos;
      const oldAwaitPos = this.state.awaitPos;
      this.state.maybeInArrowParameters = true;
      this.state.yieldPos = 0;
      this.state.awaitPos = 0;

      this.next();

      let node = this.startNodeAt(startPos, startLoc);
      node.callee = base;

      const oldCommaAfterSpreadAt = this.state.commaAfterSpreadAt;
      this.state.commaAfterSpreadAt = -1;

      node.arguments = this.parseCallExpressionArguments(
        tt.parenR,
        maybeAsyncArrow,
        base.type === "Import",
        base.type !== "Super",
      );
      if (!state.optionalChainMember) {
        this.finishCallExpression(node);
      } else {
        this.finishOptionalCallExpression(node);
      }

      if (maybeAsyncArrow && this.shouldParseAsyncArrow()) {
        state.stop = true;

        this.checkCommaAfterRestFromSpread();

        node = this.parseAsyncArrowFromCallExpression(
          this.startNodeAt(startPos, startLoc),
          node,
        );
        this.checkYieldAwaitInDefaultParams();
        this.state.yieldPos = oldYieldPos;
        this.state.awaitPos = oldAwaitPos;
      } else {
        this.toReferencedListDeep(node.arguments);

        // We keep the old value if it isn't null, for cases like
        //   (x = async(yield)) => {}
        this.state.yieldPos = oldYieldPos || this.state.yieldPos;
        this.state.awaitPos = oldAwaitPos || this.state.awaitPos;
      }

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      this.state.commaAfterSpreadAt = oldCommaAfterSpreadAt;

      return node;
    } else if (this.match(tt.backQuote)) {
      return this.parseTaggedTemplateExpression(
        startPos,
        startLoc,
        base,
        state,
      );
    } else {
      state.stop = true;
      return base;
    }
  }
```

The method's body consists of a series of conditional checks that determine the specific type of subscript expression being parsed. It uses methods like eat, match, and next to consume tokens from the source code and to advance the parser's position. These tokens represent syntax elements such as dots for property access, brackets for computed property access or array indexing, and parentheses for function calls.

Bind Expression Parsing: If the doubleColon token is encountered and noCalls is false, it parses a bind expression (e.g., a::b), marking the parsing state to stop further subscript parsing.

Optional Chaining: When the questionDot token is found, it indicates the start of an optional chaining expression (e.g., a?.b). The method then checks for different scenarios like computed property access (a?.[0]), optional call expressions (a?.()), and direct property access with optional chaining (a?.b). Each of these scenarios is handled by creating a node representing the expression, setting properties on the node to reflect the parsed structure, and then finishing the node with the appropriate type.

Property Access and Computed Property Access: The method also handles regular property access (a.b) and computed property access (a[b]) by checking for the presence of a dot or an opening bracket, respectively. It constructs the corresponding expression nodes accordingly.

Function Call Parsing: If a parenthesis token is encountered and noCalls is false, it indicates a function call. The method parses the arguments of the call, handles potential async arrow functions, and finishes the call expression node. It also adjusts parser state variables related to async and yield parsing.

Tagged Template Expression Parsing: If a backquote token is matched, it indicates the start of a tagged template expression, which is then parsed accordingly.

Stopping Condition: If none of the conditions for specific subscript types are met, the method sets the parsing state to stop, indicating that no further subscript parsing should occur for the current expression.

Throughout the parsing process, the method makes extensive use of the parser's state and utility methods to accurately construct the abstract syntax tree (AST) nodes representing the parsed expressions. This method is crucial for enabling the parsing of complex expression syntax in JavaScript, handling both standard features and more recent additions like optional chaining.