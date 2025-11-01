---
title: Limit
description: LIMIT controls the number of tuples returned from a query.
---

`LIMIT` controls the number of tuples returned from a query. It is often used within an [ORDER BY](/cypher/query-clauses/order-by)
clause to fetch the top-k tuples from the query result. Note that `LIMIT` accepts any expression that can be evaluated to an integer.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example, the following query returns the three oldest users:

```cypher
MATCH (u:User)
RETURN u.name
ORDER BY u.age DESC
LIMIT 3;
```
```table
┌─────────┐
│ u.name  │
│ STRING  │
├─────────┤
│ Zhang   │
│ Karissa │
│ Adam    │
└─────────┘
```

If you omit the `ORDER BY`, you would get some k tuples in a `LIMIT k` query,
but there is no guarantee about which ones will be selected.


The number of rows to limit can either be:
1. A parameter expression when used with a prepared statement:

Prepare:
```c++
auto prepared = conn->prepare("MATCH (u:User) RETURN u.name limit $lt")
```
Execution:
The number of rows to limit can be given at the time of execution.
```c++
conn->execute(prepared.get(), std::make_pair(std::string{"lt"}, 1))
```
```table
┌────────┐
│ u.name │
│ STRING │
├────────┤
│ Adam   │
└────────┘
```
2. A literal expression which can be evaluated at compile time.
```cypher
MATCH (u:User)
RETURN u.name
LIMIT 1+2
```

```table
┌─────────┐
│ u.name  │
│ STRING  │
├─────────┤
│ Adam    │
│ Karissa │
│ Zhang   │
└─────────┘
```

