
This proposal was approved for Stage 1 in the May 2018 TC39 meeting, and 

- slides for that presentation are available [here](https://docs.google.com/presentation/d/1WPyAO4pHRsfwGoiIZupz_-tzAdv8mirw-aZfbxbAVcQ).
- Its current form was presented to TC39 in the April 2021 meeting ([slides](https://hackmd.io/@mpcsh/HkZ712ig_#/)).


## Slide 8: Priority: exhaustiveness and ordering

* Fall-through and "no match" should be opt-in, not opt-out
* Execution order should never be surprising

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