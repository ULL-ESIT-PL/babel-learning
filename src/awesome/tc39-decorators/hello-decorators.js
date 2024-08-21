function logMethod(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    console.log(`Calling ${propertyKey} with arguments: ${args}`);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class MyClass {
  @logMethod
  myMethod(arg) {
    return `Result: ${arg}`;
  }
}

const obj = new MyClass();
obj.myMethod(42); // Logs: Calling myMethod with arguments: 42