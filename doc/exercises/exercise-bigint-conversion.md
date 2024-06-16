
# Promote Integer to BigInt when necessary

The semantics of the `BigInt` type are similar to the `Number` type.
When operating a `BigInt` with a number the result is an exception. 
To convert a `Number` to a `BigInt` use the `BigInt()` constructor.
Write a Babel plugin to promote the number to a `BigInt` when the constant is an integer one.

See solution in [/src/exercises/exercise-bigint-conversion/](/src/exercises/exercise-bigint-conversion/).