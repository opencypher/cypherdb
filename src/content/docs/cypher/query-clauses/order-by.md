---
title: Order By
description: ORDER BY is the clause where you define the order in which you want the query results to be displayed or sort a set of tuples you computed up to a point in your query.
---

Order by is the clause where you define the order in which you want the query results to be displayed
or sort a set of tuples you computed up to a point in your query.  Kuzu currently supports two
sorting orders: `ASC`, `DESC`. By default if no sorting order is specified, Kuzu sorts
rows in ascending order and NULLs are placed first.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

## Basic example
The following query returns users' names and ages, ordered by `age` using the default ordering (i.e., ascending order):

```cypher
MATCH (u:User)
RETURN u.name, u.age
ORDER BY u.age;
```

```table
┌─────────┬───────┐
│ u.name  │ u.age │
├─────────┼───────┤
│ Noura   │ 25    │
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
└─────────┴───────┘
```

Similarly, the following returns the names of users who live in `Waterloo`, ordered by `age` in descending order.

Query:
```cypher
MATCH (u:User)-[:LivesIn]->(c:City)
WHERE c.name = 'Waterloo'
RETURN u.name, u.age
ORDER BY u.age DESC;
```

```table
┌─────────┬───────┐
│ u.name  │ u.age │
├─────────┼───────┤
│ Karissa │ 40    │
│ Adam    │ 30    │
└─────────┴───────┘
```

## Ordering using multiple properties or expressions
You can also order using multiple properties or expressions that are in scope in your query.
The meaning is that the first expression forms the primary order, then ties are broken
according to the second order, then further ties are broken according third order, etc.
Each order can be ascending or descending independent of the others.
For example, the following query sorts the results of 1-hop `(a:User)-[:Follows]->(b:User)`
queries first by `b.age` and then by `a.name` both in descending order.

```cypher
MATCH (a:User)-[:Follows]->(b:User)
RETURN b.age, a.name 
ORDER BY b.age DESC, a.name DESC;
```

```table
┌───────┬─────────┐
│ b.age │ a.name  │
├───────┼─────────┤
│ 50    │ Karissa │
│ 50    │ Adam    │
│ 40    │ Adam    │
│ 25    │ Zhang   │
└───────┴─────────┘
```

Note that there is a tie for `b.age` in the first two rows and the order is 
decided based on `a.name` (in descending order). If you removed the
last `DESC` in the above query, the first two tuples in the result
would be swapped.

:::caution[ORDER BY after WITH]
You can use ORDER BY after [WITH](/cypher/query-clauses/with) **only** if you use a LIMIT and/or SKIP, so you should
use it to keep or remove the top-k or bottom-k intermediate tuples. The reason for this
restriction is that otherwise, ordering intermediate results is not useful, because if 
a query has more computation to do after the WITH and ORDER BY, the operators on those following
parts ignore the order. So if there is no LIMIT or SKIP, ordering does not guarantee your result order.
:::
