# Labels and isLoop

In JavaScript, you can **label** statements and then use these labels to control the flow of execution with `break` and `continue` statements. 

`isLoop` marks a keyword as starting a loop like in `_for: createKeyword("for", { isLoop })`, 
which is important
to know when parsing a **label**, in order to allow or disallow
continue jumps to that label.

The `continue` statement can only target labels associated with loops. If a label is not associated with a loop, the `continue` statement is invalid. The `isLoop` flag helps Babel determine whether a label is associated with a loop, ensuring that continue statements are used correctly.

When parsing a label, the Babel parser needs to know whether the statement following the label is a loop or not. The `isLoop` flag assists in this determination, allowing the parser to enforce the correct usage of `continue` and `break` statements.
