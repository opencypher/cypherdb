---
title: LIST and ARRAY
description: "Variable-length LIST and fixed-length ARRAY data types for storing collections"
---

Kuzu supports two list-like data types: (i) variable-length lists, simply called `LIST`, and (ii)
fixed-length lists, called `ARRAY`.

:::note[Info]
`ARRAY` is a special case of `LIST`, where the length of the `LIST` is fixed and known upfront.
:::

## LIST

A `LIST` can contain an arbitrary number of values, but they must all be of the same type. The types
inside a `LIST` can be any of those supported by Kuzu, including nested/complex types. Some examples are shown below:

- `STRING[]` is a `LIST` of `STRING` values
- `INT64[]` is a `LIST` of `INT64` values
- `STRING[][]` is a `LIST` of `LIST` of `STRING` values
- `MAP(STRING, STRING)[]` is a `LIST` of `MAP(STRING, STRING)` values

#### Create a `LIST`

In Cypher, enclosing comma-separated values in square brackets will store the values as a `LIST`. The type
of the elements is inferred by the query parser during the binding stage.

```cypher
RETURN ["Alice", "Bob"] AS l;
```

```table
┌─────────────┐
│ l           │
├─────────────┤
│ [Alice,Bob] │
└─────────────┘
```

:::danger[Note]
If you try to create a `LIST` with elements that are of different types, an exception will be thrown.

```cypher
kuzu> RETURN ["Alice", 1] AS l;
Error: Binder exception: Cannot bind LIST_CREATION with parameter type STRING and INT64.
```
:::

You can also create a `LIST` by explicitly calling the creation function as follows.

```cypher
RETURN list_creation(1,2,3,4) AS l;
```

```table
┌───────────┐
│ l         │
├───────────┤
│ [1,2,3,4] │
└───────────┘
```

#### `UNWIND` a `LIST`

You can use the `UNWIND` clause to expand a list into individual rows:
```cypher
UNWIND [[1,2], [3], [4, 5]] AS x 
UNWIND x as y 
RETURN y;
```

```table
┌─────┐
│ y   │
├─────┤
│ 1   │
│ 2   │
│ 3   │
│ 4   │
│ 5   │
└─────┘
(6 tuples)
(1 column)
```

#### `LIST` functions

A full list of functions used to transform or manipulate lists can be found [here](/cypher/expressions/list-functions).

## ARRAY

`ARRAY` is a special case of `LIST`, in which the number of elements is fixed. Just like a `LIST`,
all values in `ARRAY` must be of the same type. The number of elements is specified as an
integer inside square brackets. Some examples are shown below:

- `INT64[256]` is an `ARRAY` of `INT64` values, with 256 elements
- `DOUBLE[512]` is an `ARRAY` of `DOUBLE` values, with 512 elements

An `ARRAY` is useful for storing items like embeddings (for use in similarity search or in machine learning
via our PyTorch Geometric integration), where the number of elements is fixed and known in advance.

You can create an array of any data type and size, including nested types using explicit casting.
Some examples are listed below:

#### `ARRAY` of type `INT64` and size 4

This is an example of creating an array with elements that are primitive types (integers).

```cypher
RETURN CAST([3,4,12,11], 'INT64[4]');
```

```table
┌────────────────────────────────────────────┐
│ CAST(LIST_CREATION(3,4,12,11), INT64[4])   │
├────────────────────────────────────────────┤
│ [3,4,12,11]                                │
└────────────────────────────────────────────┘
```

#### `ARRAY` of `LIST`s of type `INT64` and size 3

This is an example of creating an array whose elements are nested types that are themselves `LIST`s
containing elements of a primitive type (integers).

```cypher
RETURN CAST([[5,2,1],[2,3],[15,64,74]], 'INT64[][3]');
```

```table
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CAST(LIST_CREATION(LIST_CREATION(5,2,1),LIST_CREATION(2,3),LIST_CREATION(15,64,74)), INT64[][3])   │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [[5,2,1],[2,3],[15,64,74]]                                                                         │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### `UNWIND` an `ARRAY`

`UNWIND`ing an `ARRAY` works exactly as shown [above](#unwind-a-list) for the `LIST` type:

```cypher
UNWIND CAST([[1,2,3],[3],[4,5]], 'INT64[][3]') AS x UNWIND x AS y RETURN y;
```

```table
┌─────┐
│ y   │
├─────┤
│ 1   │
│ 2   │
│ 3   │
│ 3   │
│ 4   │
│ 5   │
└─────┘
(6 tuples)
(1 column)
```

#### `ARRAY` functions

A full list of functions used to transform or manipulate arrays can be found [here](/cypher/expressions/array-functions).