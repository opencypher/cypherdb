---
title: Create (clause)
description: Insert records into your node and relationship tables.
---

Not to be confused with the `CREATE` statement from the DDL, the `CREATE` clause in openCypher is
similar to the `INSERT` clause of SQL and allows you to insert records into your node and relationship
tables. We describe the generic semantics of the `CREATE` clause [below](#general-semantics).

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/data-manipulation-clauses/example-database).

## Insert new nodes
The following query inserts a single node record, `(Alice, 35)`, into the `User` node table:

```cypher
CREATE (u:User {name: 'Alice', age: 35});
```
The properties to be set are specified using a mapping: `{prop1 : val1, prop2 : val2, ...}`.

You can now query the database for a `User` node with name `Alice`:
```cypher
MATCH (a:User) 
WHERE a.name = 'Alice' 
RETURN a.*;
```
```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 35    │
└────────┴───────┘
```

Any node property that is not specified in the mapping but exists in the schema will be set to NULL.
For example, the following query will set the age property of
the inserted node record to NULL.

:::caution[Note]
Note that for node records, the primary key property (in our example, "name"), **must be** non-NULL.
:::

```cypher
CREATE (u:User {name: 'Dimitri'});
```

```cypher
MATCH (a:User) 
WHERE a.name = 'Dimitri'
RETURN a.*;
```
```table
┌─────────┬───────┐
│ a.name  │ a.age │
│ STRING  │ INT64 │
├─────────┼───────┤
│ Dimitri │       │
└─────────┴───────┘
```

## Insert new relationships
You can insert records to your relationship tables by
first binding two variables `s` and `t` to nodes, and then
"drawing" a relationship pattern between `s` and `t`. 
For example, the following creates a Follows relationship
from the User node with name `Adam` to the User node with
name `Noura`.
```cypher
MATCH (u1:User), (u2:User)
WHERE u1.name = 'Adam' AND u2.name = 'Noura' 
CREATE (u1)-[:Follows {since: 2011}]->(u2);
```
Similar to node records, any relationship property that is not
specified in the insert statement will be set to `NULL`.

## General semantics
The general semantics of `CREATE` is described here. You can specify
an arbitrary graph pattern `P` after the `CREATE` clause.
Then, for each tuple `t` that was produced before the `CREATE` statement,
each node `n` and relationship `r` that is not bound by `t` is inserted
as a new node and relationship. For example, the following query
adds a `Follows` relationship with `since=2022` from User node `Zhang`
to every other User node (including from `Zhang` to `Zhang`)  in the database:

```cypher
MATCH (a:User), (b:User) 
WHERE a.name = "Zhang" 
CREATE (a)-[:Follows {since:2022}]->(b);
```
This is because the `a` variable matches to User node `Zhang` and the `b` variable matches to any
node in the `User` table. As a result, this query creates a `Follows` relationship from the `User` node
`Zhang` to every other `User` node.

