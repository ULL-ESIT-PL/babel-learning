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
    if (!noCalls && this.eat(tt.doubleColon)) { // S.t. like a::b
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