---
title: Casting
description: Casting is the act of converting a value that is of one particular data type to another data type.
---

Casting refers to the operation of converting a value that is of one particular data type, to another data type.
This is done in Kuzu using the `CAST` function.

There are two ways to utilize the `CAST` function. The syntax for either approach is below:

- `CAST(source, "type")`: In this approach, you pass in the source value as an argument to the `CAST` function, and the target data type as a string argument.
- `CAST(source AS type)`: In this approach, you use the `AS` keyword to cast the provided value to the target data type.

A floating-point number can be cast to an integer:

```cypher
// This works
RETURN CAST(2.3, "INT8") AS l;
// This also works
RETURN CAST(2.3 AS INT8) AS l;
```
Returns:
```table
┌─────┐
│ l   │
├─────┤
│ 2   │
└─────┘
```

Not all inputs can be cast to every data type. For example, `INT[]` cannot be cast to `INT`. Even
if a cast between the input's data type to the target type is well defined, the cast can still fail
if the input's value is not suitable to cast. For example, casting the `STRING` data type to
`INT` is well defined -- you cannot cast `"abc"` to `INT`, but you can cast `"12"` to `INT`.

```cypher
RETURN CAST("12" AS INT) AS l;
```
Returns:
```table
┌─────┐
│ l   │
├─────┤
│ 12  │
└─────┘
```

A string array can be cast to an integer array as follows:

```cypher
RETURN CAST("[1,2,3]" AS INT[]) AS l;
```
Returns:
```table
┌─────────┐
│ l       │
├─────────┤
│ [1,2,3] │
└─────────┘
```
