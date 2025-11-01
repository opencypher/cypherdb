---
title: Subqueries
description: "Use EXISTS and COUNT subqueries to check patterns and aggregate results within queries"
---

A subquery is a query that's called from an enclosing outer query, and executes within its own scope.
It is defined in Cypher within curly braces `{}`, and unlike [DDL subqueries](/import/copy-from-subquery), a Cypher subquery
cannot contain a `RETURN` clause. The supported subqueries in Kuzu's implementation of openCypher are listed below.

## EXISTS

The `EXISTS` subquery checks if given pattern has at least one match in the graph.

The following query searches for all Users who have at least one 3-hop Follows
path starting from them.

```cypher
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User)} 
RETURN a.name, a.age;
```

```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 30    │
└────────┴───────┘
```

#### Nested `EXISTS` subquery
You can also specify nested subqueries, i.e., a `WHERE EXISTS` subquery inside another `WHERE EXISTS`.

For example:

```cypher
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)-[:Follows]->(c:User)} } 
RETURN a.name, a.age;
```

```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
└────────┴───────┘
```

This query returns an empty result because in example database, only `Adam` has a 3-hop `Follows` path
and the destination `b` node of that path is `Noura`. However, `Noura` does not have an outgoing
`Follows` relationship.

If we instead specified that the destination `b` node has an incoming edge, by swapping the direction
of the relationship in the inner `(b)-[:Follows]->(c:User)` pattern to `(b)<-[:Follows]-(c:User)`,
we would get the `(Adam, 30)` tuple back because `Noura` has incoming `Follows` relationships.

```cypher
MATCH (a:User)
WHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)<-[:Follows]-(c:User)} } 
RETURN a.name, a.age;
```

```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 30    │
└────────┴───────┘
```

## COUNT

The `COUNT` subquery checks the number of matches for given pattern in the graph. The output of this
counting can be bound to a variable with aliasing.

For example, the following query counts number of followers for each user.

```cypher
MATCH (a:User)
RETURN a.name, COUNT { MATCH (a)<-[:Follows]-(b:User) } AS num_follower ORDER BY num_follower;
```

```table
┌─────────┬──────────────┐
│ a.name  │ num_follower │
│ STRING  │ INT64        │
├─────────┼──────────────┤
│ Adam    │ 0            │
│ Karissa │ 1            │
│ Noura   │ 1            │
│ Zhang   │ 2            │
└─────────┴──────────────┘
```
A count subquery can also be used in a `WHERE` clause as an expression that returns an integer value.

```cypher
MATCH (a:User)
WHERE COUNT { MATCH (a)<-[:Follows]-(b:User) } = 1
RETURN a.name;
```

```table
┌─────────┐
│ a.name  │
│ STRING  │
├─────────┤
│ Karissa │
│ Noura   │
└─────────┘
```

### COUNT with DISTINCT

The `COUNT` subquery can also be used with `DISTINCT` to count the number of unique matches for a given pattern.

For example, the following query counts the number of unique followers for each user.

```cypher
MATCH (a:User)-[e:Follows*1..2]->(b:User)
WHERE a.name = 'Karissa'
RETURN COUNT(DISTINCT b) AS num_unique_followers;
```

```table
┌──────────────────────┐
│ num_unique_followers │
│ INT64                │
├──────────────────────┤
│ 2                    │
└──────────────────────┘
```


