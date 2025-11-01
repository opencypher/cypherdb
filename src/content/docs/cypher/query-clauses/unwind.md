---
title: Unwind
description: UNWIND allows you to unnest or explode a list into its individual elements.
---

`UNWIND` allows you to unnest or explode a list `L` that has `k` elements in it,
into a table `T` with `k` elements.
When using `UNWIND`, you need to specify an alias to refer to the elements
of the exploded list, i.e., `T`.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example, the following explodes a list of strings into multiple rows and returns its individual elements:

```cypher
UNWIND ["Amy", "Bob", "Carol"] AS x
RETURN x;
```

```table
┌────────┐
│ x      │
│ STRING │
├────────┤
│ Amy    │
│ Bob    │
│ Carol  │
└────────┘
```

If the `UNWIND`ed list L contained as elements other lists,
then the output would be elements with one fewer nesting. For example, if L was a list of 
list of strings, after unwinding, you'd get a table of list of strings. For example:

```cypher
UNWIND [["Amy"], ["Bob", "Carol"]] AS x
RETURN x;
```

```table
┌─────────────┐
│ x           │
│ STRING[]    │
├─────────────┤
│ [Amy]       │
│ [Bob,Carol] │
└─────────────┘
```

## Using `UNWIND` with `WHERE` predicates

You can also use the `WHERE` predicate with `UNWIND`. For example, say you want to return the
elements of a given list that are greater than 2.

You might think that the following query will work:

```cypher
UNWIND [1, 2, 3, 4, 5] AS x
WHERE x > 2
RETURN x;
```
However, this will throw a parser error:
```
Error: Parser exception: Query must conclude with RETURN clause (line: 1, offset: 0)
"UNWIND [1, 2, 3, 4, 5] AS x WHERE x > 2 RETURN x"
 ^^^^^^
```

The use of `WHERE` predicates directly after `UNWIND` is not allowed. You can attach a `WITH` clause
immediately after `UNWIND` to achieve the result.

```cypher
UNWIND [1, 2, 3, 4, 5] AS x
WITH x
WHERE x > 2
RETURN x;
```

```table
┌───────┐
│ x     │
│ INT64 │
├───────┤
│ 3     │
│ 4     │
│ 5     │
└───────┘
```

