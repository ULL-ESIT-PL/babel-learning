
## Introduction 

Decorators in JavaScript are a proposal (still in Stage 3 as of 2024) that provides a syntax for wrapping or modifying classes, methods, and properties. Decorators allow you to add additional functionality to a method, class, or property without modifying the original code directly. They are essentially functions that are called with a target (such as a class or a method) and can modify or enhance the behavior of that target.

### Basic Concepts:
1. **Class Decorators**: These are applied to a class as a whole. They can be used to modify or enhance the class definition.
   
   ```javascript
   @decoratorFunction
   class MyClass {
     // class definition
   }
   ```

2. **Method Decorators**: These are applied to individual methods within a class. They can modify how the method behaves or interact with metadata associated with the method.
   
   ```javascript
   class MyClass {
     @decoratorFunction
     myMethod() {
       // method definition
     }
   }
   ```

3. **Property Decorators**: These are applied to individual properties within a class, allowing you to control aspects of the property's behavior, such as validation or transformation.
   
   ```javascript
   class MyClass {
     @decoratorFunction
     myProperty;
   }
   ```

4. **Parameter Decorators**: These can be applied to parameters of methods within a class. They can be used to modify the way parameters are passed to the method.

   ```javascript
   class MyClass {
     myMethod(@decoratorFunction param) {
       // method definition
     }
   }
   ```

### How They Work:
- **Definition**: A decorator is a function that is invoked with specific arguments, depending on what it is decorating (a class, method, property, etc.).
- **Usage**: The decorator function can return a new function, modify the target's behavior, or even replace the target with a new definition.

### Status:
- **Stage 3**: The decorators proposal is currently in Stage 3 of the TC39 process, meaning it is well-defined but still not part of the official ECMAScript standard. It's supported by some tools like Babel, which allows developers to use decorators in their code today.

### Use Cases:

- **Logging and Debugging**: Automatically log method calls, arguments, and results.
- **Access Control**: Check permissions before allowing a method to be executed.
- **Memoization**: Cache the result of expensive function calls.
- **Validation**: Ensure that method parameters or properties meet certain criteria.


## Simple Example:

See [hello-decorators.js](hello-decorators.js)

### Compile and Run the Code

```
➜  tc39-decorators git:(main) ✗ npx babel hello-decorators.js -o tmp.js
➜  tc39-decorators git:(main) ✗ node tmp.js 
Calling myMethod with arguments: 42
```