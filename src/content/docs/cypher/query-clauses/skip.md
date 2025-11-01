---
title: Skip
description: SKIP controls the number of tuples to skip from the start of the query result.
---

`SKIP` controls the number of tuples to skip from the start of the query result. It is often used within an [ORDER BY](/cypher/query-clauses/order-by)
clause to skip the top k tuples from the query result.
Note: SKIP accepts any expression that can be evaluated to an integer.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example, the following query skips the 2 youngest users
and returns the rest of the users' ages.
Query:
```cypher
MATCH (u:User)
RETURN u.name
ORDER BY u.age
SKIP 2;
```
```table
┌─────────┐
│ u.name  │
│ STRING  │
├─────────┤
│ Karissa │
│ Zhang   │
└─────────┘
```

If you omit the `ORDER BY`, you would skip some k tuples in a `SKIP` k query
but there is no guarantee about which ones will be skipped.


The number of rows to skip can either be:
1. A parameter expression when used with prepared statement:

Prepare:
```c++
auto prepared = conn->prepare("MATCH (u:User) RETURN u.name skip $sp")
```

Execution:

The number of rows to skip can be given at the time of execution.
```c++
conn->execute(prepared.get(), std::make_pair(std::string{"sp"}, 2))
```
```table
┌────────┐
│ u.name │
│ STRING │
├────────┤
│ Zhang  │
│ Noura  │
└────────┘
```
2. A literal expression which can be evaluated at compile time.
```cypher
MATCH (u:User)
RETURN u.name
skip 2+1
```

```table
┌────────┐
│ u.name │
│ STRING │
├────────┤
│ Noura  │
└────────┘
```
