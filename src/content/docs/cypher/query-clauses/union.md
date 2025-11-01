---
title: Union
description: UNION is the clause where you combine query result A and query result B that have the same schema but were produced by different queries into a single result C by taking their union.
---

`UNION` is the clause where you combine query result A and query result B
that have the same schema but were produced by different queries into a single result C
by taking their union. Two notes:

- The number of columns and data type of each column must be identical in A and B but their names can be different.
- UNION will remove all duplicates in the union of A and B. Instead, UNION ALL preserves the duplicates.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example, the following query returns the age of the follower
of Zhang and Karissa without duplicate elimination:

```cypher
MATCH (u1:User)-[:Follows]->(u2:User)
WHERE u2.name = 'Zhang'
RETURN u1.age
UNION ALL
MATCH (u3:User)-[:Follows]->(u4:User)
WHERE u4.name = 'Karissa'
RETURN u3.age;
```

```table
┌─────────┐
│ u1.age  │
├─────────┤
│ 30      │
│ 40      │
│ 30      │
└─────────┘
```

If you changed `UNION ALL` to `UNION` in the above query, one of the 30's in the output
would be removed. So the result would be:

```table
┌─────┐
│ 30  │
│ 40  │
└─────┘
```
