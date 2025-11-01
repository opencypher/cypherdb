---
title: Where
description: WHERE clause is where you specify predicates/constraints on a previous part of your query.
---

`WHERE` clause is where you specify predicates/constraints on a previous part of your query.
Regardless of what comes before WHERE, the semantics of WHERE is this two step computation:

1. `WHERE` takes the tuples that the previous parts of your query has generated (up to the WHERE clause);
1. It then runs the boolean predicate specified in the WHERE clause and outputs those that pass the predicates to
the next part of your query.

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/query-clauses/example-database).

For example:

```cypher
MATCH (a:User)
WHERE a.age > 45 OR starts_with(a.name, "Kar")
RETURN *;
```

```table
┌──────────────────────────────────────────────────┐
│ a                                                │
│ NODE                                             │
├──────────────────────────────────────────────────┤
│ {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} │
│ {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}   │
└──────────────────────────────────────────────────┘
```

The boolean predicate specified above can be understood as it reads: Find users whose ages are
greater than `45` OR whose names start with `Kar`. It combines several means to construct expressions in high-level database query languages, such as a boolean operator (OR), a numeric comparison operator (>), and a string function (starts_with). You can learn more about the operators, functions, and expressions [here](/cypher/expressions).

## Filter with NULL
If an expression is evaluated as NULL, it will be treated as FALSE in `WHERE` clause. To check if an expression is NULL, please refer to [comparison operators on NULLs](/cypher/data-types#null).

The following predicate in the WHERE clause filters User nodes whose name start with "Kar" and whose age properties are not NULL.
```cypher
MATCH (a:User)
WHERE a.age IS NOT NULL AND starts_with(a.name, "Kar")
RETURN *;
```

```table
┌──────────────────────────────────────────────────┐
│ a                                                │
│ NODE                                             │
├──────────────────────────────────────────────────┤
│ {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} │
└──────────────────────────────────────────────────┘
```

## `WHERE` subquery on a relationship

You can also specify a subquery that matches a relationship using the `WHERE` clause.

```cypher
MATCH (a:User)
WHERE (a)-[r1:Follows]->(b:User {name: "Noura"})-[r2:LivesIn]->(c:City {name: "Guelph"})
RETURN a;
```
```table
┌────────────────────────────────────────────────┐
│ a                                              │
│ NODE                                           │
├────────────────────────────────────────────────┤
│ {_ID: 0:2, _LABEL: User, name: Zhang, age: 50} │
└────────────────────────────────────────────────┘
```

The above query matches users who follow `Noura` and live in `Guelph`. Note that you can only
`RETURN` the nodes that are in the scope of the `MATCH` clause (the nodes and relationships that
are in the `WHERE` clause are not returned).

