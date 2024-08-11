
This proposal was approved for Stage 1 in the May 2018 TC39 meeting, and 

- slides for that presentation are available [here](https://docs.google.com/presentation/d/1WPyAO4pHRsfwGoiIZupz_-tzAdv8mirw-aZfbxbAVcQ).
- Its current form was presented to TC39 in the April 2021 meeting ([slides](https://hackmd.io/@mpcsh/HkZ712ig_#/)).

## Slide 5: Priority: subsumption of switch

> * Easily googleable; zero syntactic overlap
> * Reduce reasons to reach for switch
> * Preserve the good parts of switch

In the context of the ECMAScript Pattern Matching proposal, the phrases you're asking about refer to the goals and considerations behind the design of the feature. Let's break down each part:

### **Subsumption:**
- **Subsumption** in this context means that the new pattern matching feature should encompass or replace the functionality provided by the existing `switch` statement in JavaScript. The idea is that pattern matching should be able to do everything `switch` can do, and more, in a more expressive and safer way. In other words, pattern matching should make `switch` statements obsolete or less necessary, because it can "subsume" the role of `switch`.

### **Easily Googleable:**
- The phrase **"easily googleable"** refers to the ability of developers to search for and find information about the feature online using search engines like Google. The goal is to design the syntax and terminology of pattern matching in a way that is distinctive and clear, so that developers can easily look it up and find relevant resources. If a feature has zero syntactic overlap with existing features, it reduces confusion and makes it easier to search for.

### **Zero Syntactic Overlap:**
- **Zero syntactic overlap** means that the new pattern matching syntax should be distinct from the syntax of existing language constructs, like `switch`. This ensures that there is no ambiguity or confusion when developers write code, and it also helps in making the feature "easily googleable."

### **Reduce Reasons to Reach for `switch`:**
- This phrase means that the introduction of pattern matching should minimize the need for developers to use `switch` statements. Pattern matching should provide a more powerful, expressive, and safer alternative, so that developers naturally prefer it over `switch`.

### **Preserve the Good Parts of `switch`:**
- Finally, while the proposal aims to make pattern matching a superior alternative, it also acknowledges that `switch` has some useful features that should be retained. The goal is to incorporate the best aspects of `switch` into the new pattern matching feature, ensuring that developers don’t lose any functionality they rely on.

### Summary:
- **Subsumption**: Pattern matching should replace `switch` by offering all its functionality and more.
- **Easily Googleable**: The feature's syntax and terminology should be unique enough to be easy to search for online.
- **Zero Syntactic Overlap**: The new syntax should not conflict with existing language constructs, making it clear and distinct.
- **Reduce Reasons to Reach for `switch`**: Pattern matching should be so useful that developers rarely need `switch`.
- **Preserve the Good Parts of `switch`**: Retain useful features of `switch` in the new pattern matching syntax.

This approach reflects a careful balance between introducing new, more powerful features and ensuring they are intuitive, accessible, and non-disruptive to existing code.

## Slide 6: Priority: be better than switch

> * No more footguns
> * New capabilities

## Slide 7: Priority: expression semantics

> * Pattern matching construct should be usable as an expression
>    * `return match { ... }`
>    * `let foo = match { ... }`
>    * etc

## Slide 8: Priority: exhaustiveness and ordering

> * Fall-through and "no match" should be opt-in, not opt-out
> * Execution order should never be surprising

In the context of programming language design, particularly with respect to the "ECMAScript Pattern Matching" proposal, the terms "opt-in," "opt-out," and "fall-through" have specific meanings:

### **Opt-in vs. Opt-out:**
- **Opt-in:** This means that a feature or behavior is not enabled by default and must be explicitly requested or activated by the developer. In other words, you have to "opt-in" to use it. For example, if a certain behavior (like fall-through in pattern matching) is opt-in, developers would need to explicitly write code or use a syntax to enable it.

- **Opt-out:** Conversely, opt-out means that a feature or behavior is enabled by default, and the developer must take explicit action to disable or avoid it. If a behavior is opt-out, you are automatically opted in unless you specifically choose to turn it off.

### **Fall-through:**
- **Fall-through** is a term typically associated with control flow structures, especially in the context of `switch` statements in languages like JavaScript. In a `switch` statement, fall-through occurs when the program continues executing the next case clause even after a match has been found, unless a `break` statement is used to prevent it.

  For example:
  ```js
  switch (value) {
    case 1:
      console.log("Case 1");
    case 2:
      console.log("Case 2"); // Fall-through happens here
    case 3:
      console.log("Case 3");
  }
  ```
  In the above code, if `value` is `1`, all three cases will execute because there's no `break` after `case 1`.

### **In the Context of ECMAScript Pattern Matching:**
When the proposal mentions that "fall-through and 'no match' should be opt-in, not opt-out," it is advocating for a design where these behaviors do not occur by default. 

- **Fall-through being opt-in:** The proposal suggests that in pattern matching, when a pattern matches, the execution should stop unless the developer explicitly indicates that they want to continue to the next pattern (i.e., fall-through). This would prevent unexpected behavior where multiple patterns could unintentionally be processed.

- **"No match" being opt-in:** Similarly, if no pattern matches, the proposal suggests that the programmer should explicitly handle this case rather than having it automatically proceed to some default behavior. This ensures that "no match" situations are deliberately managed, reducing the risk of errors due to unhandled cases.

In summary, the statement advocates for a pattern matching design where behaviors like fall-through and handling of unmatched cases are only enabled when the developer explicitly chooses to do so, leading to safer and more predictable code.