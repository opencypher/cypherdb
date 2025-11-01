---
title: Return
description: RETURN is similar to the `SELECT` clause of SQL. RETURN is where the final results of the query are specified.
---

# RETURN
`RETURN` is similar to the `SELECT` clause of SQL. RETURN is where the final results of the
query are specified, which can be listed as a list of expressions, e.g., variables that have
bound to nodes or relationships, aliases, or more complex expressions. RETURN can also be used 
for performing group-by and aggregations as well as duplication removing (using the `DISTINCT` clause). 
We discuss several common expressions used in RETURN.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database)

## Returning node and relationship variables
Returning variables in the query that are bound to node and relationships in the query 
is a syntactic sugar to return all properties of those variables. For example:
```cypher
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a, e;
```

```table
┌───────────────────────────────────────────┬─────────────────────────────────────────────────────┐
│ a                                         │ e                                                   │
├───────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ (label:User, 0:0, {name:Adam, age:30})    │ (0:0)-[label:Follows, {_id:2:0, since:2020}]->(0:1) │
│ (label:User, 0:0, {name:Adam, age:30})    │ (0:0)-[label:Follows, {_id:2:1, since:2020}]->(0:2) │
│ (label:User, 0:1, {name:Karissa, age:40}) │ (0:1)-[label:Follows, {_id:2:2, since:2021}]->(0:2) │
│ (label:User, 0:2, {name:Zhang, age:50})   │ (0:2)-[label:Follows, {_id:2:3, since:2022}]->(0:3) │
└───────────────────────────────────────────┴─────────────────────────────────────────────────────┘
```

## Returning all variables
Returning all variables in the query can be written as `RETURN *` as syntactic sugar. The query below returns `a` and `b`. The relationship is omitted because no variable binds to it.
```cypher
MATCH (a:User)-[:Follows]->(b:User)
RETURN *;
```

```table
┌───────────────────────────────────────────┬───────────────────────────────────────────┐
│ b                                         │ a                                         │
├───────────────────────────────────────────┼───────────────────────────────────────────┤
│ (label:User, 0:1, {name:Karissa, age:40}) │ (label:User, 0:0, {name:Adam, age:30})    │
│ (label:User, 0:2, {name:Zhang, age:50})   │ (label:User, 0:0, {name:Adam, age:30})    │
│ (label:User, 0:2, {name:Zhang, age:50})   │ (label:User, 0:1, {name:Karissa, age:40}) │
│ (label:User, 0:3, {name:Noura, age:25})   │ (label:User, 0:2, {name:Zhang, age:50})   │
└───────────────────────────────────────────┴───────────────────────────────────────────┘
```

## Returning node and relationship properties
You can also return properties of variables by explicitly specifying properties in the `RETURN` clause.
```cypher
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a.name, a.age, e.since;
```

```table
┌─────────┬───────┬─────────┐
│ a.name  │ a.age │ e.since │
├─────────┼───────┼─────────┤
│ Adam    │ 30    │ 2020    │
│ Adam    │ 30    │ 2020    │
│ Karissa │ 40    │ 2021    │
│ Zhang   │ 50    │ 2022    │
└─────────┴───────┴─────────┘
```

As syntactic sugar, Kuzu supports returning all properties of node or rel with `*`.

```cypher
MATCH (a:User) RETURN a.*;
```

```table
┌─────────┬───────┐
│ a.name  │ a.age │
├─────────┼───────┤
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
│ Noura   │ 25    │
└─────────┴───────┘
```

```cypher
MATCH (a:User)-[e:Follows]->(b:User) WHERE a.name='Adam' RETURN e.*;
```

```table
┌─────────┐
│ e.since │
├─────────┤
│ 2020    │
│ 2020    │
└─────────┘
```

## Using distinct for duplicate elimination
You can use RETURN DISTINCT to do duplicate elimination of the returned tuples.
For example, if we instead wrote `RETURN DISTINCT` in the above query, we would
eliminate one of the 2 (Adam, 30, 2020) tuples above:
```cypher
MATCH (a:User)-[e:Follows]->(b:User)
RETURN DISTINCT a.name, a.age, e.since;
```

```table
┌─────────┬───────┬─────────┐
│ a.name  │ a.age │ e.since │
├─────────┼───────┼─────────┤
│ Adam    │ 30    │ 2020    │
│ Karissa │ 40    │ 2021    │
│ Zhang   │ 50    │ 2022    │
└─────────┴───────┴─────────┘
```

## Group by and aggregations
You can group by one or more expression and perform one or more aggregations 
in a RETURN clause. For example:
```cypher
MATCH (a:User)-[:Follows]->(b:User)
RETURN a, avg(b.age) as avgFriendAge;
```

```table
┌───────────────────────────────────────────┬──────────────┐
│ a                                         │ avgFriendAge │
├───────────────────────────────────────────┼──────────────┤
│ (label:User, 0:0, {name:Adam, age:30})    │ 45.000000    │
│ (label:User, 0:1, {name:Karissa, age:40}) │ 50.000000    │
│ (label:User, 0:2, {name:Zhang, age:50})   │ 25.000000    │
└───────────────────────────────────────────┴──────────────┘
```

The semantics is exactly the same as SQL's semantics, which is a 3-step process:
1. For each tuple `t` in the previous part of the query, i.e., before the RETURN clause, 
    group `t` according to (one or more) group by key expressions into a group. Let us refer
    to the result of these expressions as `t`'s keys.
2. For each group `G`, compute the (one or more) aggregations in the query.
3. Output for each group `G`, `G`'s key(s) and the result of the aggregations. 

You can find the list of aggregation functions supported in Kuzu [here](/cypher/expressions/aggregate-functions).

:::caution[Note on NULLS]
The handling of NULLs in group by keys and values also follow the SQL semantics:
- All NULL keys are grouped into a single group.
- NULL values are ignored in aggregations.
:::
